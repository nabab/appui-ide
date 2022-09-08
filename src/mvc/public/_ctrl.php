<?php

if (!defined('BBN_BASEURL') && $ctrl->hasData('baseURL')) {
  define('BBN_BASEURL', $ctrl->data['baseURL']);
}

if (!isset($ctrl->inc->ide)) {
  $ctrl->addInc(
    'ide',
    new \bbn\Appui\Ide(
      $ctrl->db,
      $ctrl->inc->options,
      $ctrl->getRoutes(),
      $ctrl->inc->pref,
      $ctrl->post['project'] ?? ''
    )
  );
}