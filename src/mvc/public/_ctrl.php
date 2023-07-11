<?php
use bbn\Appui\Ide;

if (!defined('BBN_BASEURL') && $ctrl->hasData('baseURL')) {
  define('BBN_BASEURL', $ctrl->data['baseURL']);
}

if (!isset($ctrl->inc->ide)) {
  $ctrl->addInc(
    'ide',
    new Ide(
      $ctrl->db,
      $ctrl->inc->options,
      $ctrl->getRoutes(),
      $ctrl->inc->pref,
      $ctrl->post['project'] ?? BBN_PROJECT
    )
  );
}

return true;