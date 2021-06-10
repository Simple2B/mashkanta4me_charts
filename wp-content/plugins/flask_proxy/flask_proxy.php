<?php
/**
 * Plugin Name: Flask Proxy auth
 * Description: Multiserver authentification with Flask and Wordpress
 * Version: 1.1a
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

    if( array_intersect($paid_roles, $user->roles ) or wcs_user_has_subscription( $user->ID, '', 'active' ) ){
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

function flask_auth() {
  header('Content-Type: application/json');
  // check if POST data valid
  $user = wp_get_current_user();
  wp_send_json_success(["data"=> create_auth_key($user)]);
}

function get_my_role() {
    if (is_user_logged_in()){
        $user = wp_get_current_user();
        $paid_roles = ['administrator'];

        if( array_intersect($paid_roles, $user->roles ) or wcs_user_has_subscription( $user->ID, '', 'active' ) ){
            wp_send_json_success(["role" => "paid"]);
        } else {
            wp_send_json_success(["role" => "registered"]);
        }

    }else {
        wp_send_json_success(["role" => "unregistered"]);
    }
}

function flask_proxy_js(){
    ?>
        <script>
        function fetchAction(action, data, handler){
            const actionData = new FormData;
            actionData.append("action", action);
            actionData.append("data", JSON.stringify(data));

            fetch("/wp-admin/admin-ajax.php", {
                method: "POST",
                credentials: "include",
                body: actionData,
            }).then((resp) => {return resp.json()}).then(handler);
        }

        document.addEventListener('DOMContentLoaded', (e) => {
            const iframe = document.querySelector("iframe");
            if (iframe !== null){
                fetchAction("get_my_role", {}, (resp) => {
                    iframe.onload = function () {
                        iframe.contentWindow.postMessage({"user_role": resp.data.role}, "*");
                    }
                })

                window.addEventListener('message', (evt) => {
                    if(evt.data === "reload"){
                        document.location.reload();
                    } else if(evt.data === "get_auth_key"){
                        fetchAction("flask_auth", {}, (data) => {
                            iframe.contentWindow.postMessage({"auth_key": data.data}, "*");
                        })
                    } else if (evt.data === "show_modal"){
                        const loginWidget = document.querySelector("#user-header-login");
                        loginWidget.click();
                        window.scrollTo( 0, 0 );
                    }
                });
            }
        });
        </script>
    <?
}

function logout_flask(){
    setcookie('flask_role', "unregistered", time() + (10 * 365 * 24 * 60 * 60), "/");
}


add_action('wp_logout', 'logout_flask');
add_action('wp_ajax_flask_auth', 'flask_auth');
add_action('wp_ajax_nopriv_flask_auth', 'flask_auth');

add_action('wp_ajax_get_my_role', 'get_my_role');
add_action('wp_ajax_nopriv_get_my_role', 'get_my_role');

add_action('wp_enqueue_scripts', 'flask_proxy_js');

add_filter('allowed_http_origins', 'add_allowed_origins');

function add_allowed_origins($origins) {
    $origins[] = '*';
    return $origins;
}
?>