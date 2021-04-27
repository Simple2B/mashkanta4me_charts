<?php
/**
 * Plugin Name: Flask Proxy auth
 * Description: Multiserver authentification with Flask and Wordpress
 * Version: 0.2
 * Author: Simple2b
 *
 */

define('UUID_LENGTH', 60);

register_activation_hook( __FILE__, 'create_tmp_key_table' );

function mash_log($log_str){
    file_put_contents('mashkanta_log.txt', date('Y-m-d H:i:s') . ": " . $log_str . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function create_auth_key($user){
    global $wpdb;
    $keys_table = $wpdb->prefix . 'proxy_tmp_keys';
    $uuid = file_get_contents('/proc/sys/kernel/random/uuid');

    $search = $wpdb->get_row("SELECT id FROM " . $keys_table . " WHERE wp_user_id=" . $user->ID);
    if (!is_null($search)){
        $wpdb->delete($keys_table, ["wp_user_id" => $user->ID]);
    }

    $paid_roles = ['administrator'];
    $flask_role = "registered";

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

    return ['key_id' => $wpdb->insert_id, 'uuid' => $uuid];
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
      role VARCHAR(255),
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
    setcookie('wp_auth', create_auth_key($user), time() + (10 * 365 * 24 * 60 * 60), "/");
}

function remove_role(){
    
}

function flask_auth() {
  header('Content-Type: application/json');
  // check if POST data valid
  $errors_args = [];

  if ( empty($_POST['email'] ) || empty( $_POST['pass'] ) || empty($_POST['remember'])) {
      $errors_args['error'] = 'Error data';
      $errors_args['message'] = "Data is not valid";
      wp_send_json_error( $errors_args );
  }

  $email = sanitize_email( $_POST['email'] );
  $pass = sanitize_text_field( $_POST['pass'] );
  $remember = $_POST['remember'];

  // email check
  if ( ! $email ) {
      $errors_args['error'] = 'email';
      $errors_args['message'] = 'invalid email';
      wp_send_json_error( $errors_args );
  }

  $user = get_user_by('email', $email );
  if ( ! $user ) {

      $errors_args['error'] = 'email';
      $errors_args['message'] = 'user not found';

      wp_send_json_error( $errors_args );
  }

  if ( function_exists( 'user_verification_is_verified' ) && ! user_verification_is_verified( $user->ID ) ) {

      $errors_args['error'] = 'email';
      $errors_args['message'] = 'user not varified';
      wp_send_json_error( $errors_args );
  }

  $success = wp_signon(['user_login' => $user->user_login, 'user_password' => $pass, 'remember' => $remember], true);
    if (!is_wp_error($success)){
        wp_send_json_success(create_auth_key($user));
    }

  $errors_args['error'] = 'pass';
  $errors_args['message'] = $success->get_error_message();

  wp_send_json_error( $errors_args );
}

add_action('wp_login', 'write_flask_key', 10, 2);
add_action('wp_ajax_flask_auth', 'flask_auth', 0);
add_action('wp_ajax_nopriv_flask_auth', 'flask_auth');
add_action( 'wp_logout', 'remove_role' );

add_filter('allowed_http_origins', 'add_allowed_origins');


function add_allowed_origins($origins) {
    $origins[] = '*';
    return $origins;
}
?>