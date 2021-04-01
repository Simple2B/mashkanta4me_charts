<?php
/**
 * Plugin Name: Flask Proxy auth
 * Description: Multiserver authentification with Flask and Wordpress
 * Version: 0.1
 * Author: Simple2b
 *
 */

define('UUID_LENGTH', 60);

register_activation_hook( __FILE__, 'create_tmp_key_table' );

function mash_log($log_str){
    file_put_contents('mashkanta_log.txt', date('Y-m-d H:i:s') . ": " . $log_str . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function create_tmp_key_table(){
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

    global $wpdb;
    $tmp_keys_table_name = $wpdb->prefix . 'proxy_tmp_keys';
    $wp_users_table = $wpdb->prefix . 'users';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE " . $tmp_keys_table_name . "(
      id BIGINT(20) NOT NULL AUTO_INCREMENT,
      creation_time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
      uuid VARCHAR(" . UUID_LENGTH . ") NOT NULL,
      wp_user_id BIGINT(20) UNSIGNED NOT NULL,
      role VARCHAR(255),
      FOREIGN KEY  (wp_user_id) REFERENCES " . $wp_users_table . "(ID),
      PRIMARY KEY  (id)
    ) " . $charset_collate;

    dbDelta( $sql );

    $flask_users_table = "dashboard_users";
    $sql = "CREATE TABLE " . $flask_users_table . "(
        id BIGINT(20) NOT NULL AUTO_INCREMENT,
        role VARCHAR(255),
        PRIMARY KEY  (id)
      ) " . $charset_collate;

    dbDelta( $sql );
}

function write_flask_key($user_login, $user) {
    global $wpdb;
    $keys_table = $wpdb->prefix . 'proxy_tmp_keys';
    $uuid = file_get_contents('/proc/sys/kernel/random/uuid');

    $search = $wpdb->get_row("SELECT id FROM " . $keys_table . " WHERE wp_user_id=" . $user->ID);
    if (!is_null($search)){
        $wpdb->delete($keys_table, ["wp_user_id" => $user->ID]);
    }

    $paid_roles = ['admin'];
    $flask_role = "registered";

    // TODO: add check for active subscriber flag (woocommerce subscribers plugin)
    if( array_intersect($paid_roles, $user->roles ) ){
        $flask_role = "paid";
    }

    $wpdb->insert($keys_table,
    [
        'uuid' => $uuid,
        'wp_user_id' => $user->ID,
        'role' => $flask_role,
    ], ['%s', '%d', '%s']
    );

    $cookie_value = ['key_id' => $wpdb->insert_id, 'uuid' => $uuid];
    setcookie('wp_auth', json_encode($cookie_value), time() + (10 * 365 * 24 * 60 * 60));
}

add_action('wp_login', 'write_flask_key', 10, 2);
add_action('wp_ajax_register_user_front_end', 'register_user_front_end', 0);
add_action('wp_ajax_nopriv_register_user_front_end', 'register_user_front_end');
?>