<?php
/**
 * Plugin Name: Flask Proxy auth
 * Description: Multiserver authentification with Flask and Wordpress
 * Version: 0.1
 * Author: Simple2b
 * 
 */

define('UUID_LENGTH', 36);

register_activation_hook( __FILE__, 'create_tmp_key_table' );

function mash_log($log_str){
    file_put_contents('mashkanta_log.txt', date('Y-m-d H:i:s') . ": " . $log_str . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function create_tmp_key_table(){
    global $wpdb;
    $tmp_keys_table_name = $wpdb->prefix . 'proxy_tmp_keys';
    $wp_users_table = $wpdb->prefix . 'users';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE " . $tmp_keys_table_name . "(
      id BIGINT(20) NOT NULL AUTO_INCREMENT,
      creation_time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
      uuid VARCHAR(" . UUID_LENGTH . ") NOT NULL,
      wp_user_id BIGINT(20) UNSIGNED NOT NULL,
      roles VARCHAR(255),
      FOREIGN KEY  (wp_user_id) REFERENCES " . $wp_users_table . "(ID),
      PRIMARY KEY  (id)
    ) " . $charset_collate;

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}

function write_flask_key($user_login, $user) {
    global $wpdb;
    $keys_table = $wpdb->prefix . 'proxy_tmp_keys';
    $uuid = file_get_contents('/proc/sys/kernel/random/uuid');
    
    $wpdb->insert($keys_table, 
        [
            'uuid' => $uuid, 
            'wp_user_id' => $user->ID,
            'roles' => implode(',', $user->roles)
        ],
        ['%s', '%d', '%s']
    );
}

add_action('wp_login', 'write_flask_key', 10, 2);
?>