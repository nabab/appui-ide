<?php
/**
 * Created by PhpStorm.
 * User: BBN
 * Date: 09/12/2015
 * Time: 15:35
 */
if ( !empty($dir) &&
  !empty($this->post['uid']) &&
  !empty($this->post['dir']) &&
  !empty($this->post['path']) &&
  !empty($this->post['name'])
){
  $this->obj = $dir->rename($this->post['file'], $this->post['code'], $cfg, $this->inc->pref);
}