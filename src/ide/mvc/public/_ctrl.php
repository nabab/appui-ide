<?php
/** @var $this \bbn\mvc */
if ( isset($this->post['username'], $this->post['pass'], $this->post['salt'], $_SESSION[BBN_SESS_NAME]['salt']) ){
  if ( strpos($this->post['username'], '@') === false ){
    $this->post['username'] .= '@apst.travel';
  }
  $this->add_inc("user",
    new \apst\utilisateur($this->db, $this->post['username'], $this->post['pass'])
  );
  if ( $this->inc->user->check_session() ){
    $_SESSION[BBN_SESS_NAME]['history'] = [];
    define('BBN_USER_PATH', BBN_DATA_PATH.'users/'.$this->inc->user->get_id().'/');
    \bbn\file\dir::create_path(BBN_USER_PATH.'tmp');
    \bbn\file\dir::delete(BBN_USER_PATH.'tmp', false);
    die("1");
  }
  else{
    die($this->inc->user->get_error());
  }
}
else{

  if ( !defined('BBN_USER_PATH') ){
    $this->add_inc("user", new \apst\utilisateur($this->db));

    // Login with link
    if ( isset($this->post['key'], $this->post['id'], $this->post['pass1'], $this->post['pass2'], $this->post['action']) &&
      ($this->post['action'] === 'init_password') &&
      ($this->post['pass1'] === $this->post['pass2']) &&
      $this->inc->user->check_magic_string($this->post['id'], $this->post['key'])
    ){
      $this->inc->user->expire_hotlink($_POST['id']);
      $this->inc->user->force_password($_POST['pass2']);
      unset($_SESSION[BBN_SESS_NAME]);
      header('Location: home');
      die();
    }
    if ( !empty($_SERVER['REDIRECT_URL']) && strpos('logo-apst.jpg', $_SERVER['REDIRECT_URL']) ){
      $this->reroute('logo_mail');
    }
    else if ( $this->get_mode() === 'dom' ){
      return 1;
    }
    else if ( isset($this->inc->user) && $this->inc->user->check_session() ){
      \bbn\appui\history::set_huser($_SESSION[BBN_SESS_NAME]['user']['id']);
      define('BBN_USER_PATH', BBN_DATA_PATH.'users/'.$this->inc->user->get_id().'/');
    }
    /*
    else if ( !empty($_POST) ) {
      die('{"appui_disconnected":true}');
    }
    */
    else{
      $this->reroute('login');
    }
  }
  else{
    return 1;
  }
}

/* @var $path string The controller that will be called */
$path = $this->say_path();
$this->log('path: '.$path, 'USER: '.$this->inc->user->check());
/* @var $authorized array The authorized pages for the non logged in users */
$authorized = ['login', 'profil', 'password', 'check_connect', 'lost_pass'];
if ( in_array($path, $authorized) ){
  return 1;
}
// Checks if the user is connected
if ( !$this->inc->user->check() ){
  $this->reroute('login');
  return 1;
}
