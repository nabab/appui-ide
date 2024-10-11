<?php
use bbn\Appui\Ide;

if (!isset($ctrl->inc->ide)) {
  $ctrl->addInc(
    'ide',
    new Ide(
      $ctrl->db,
      $ctrl->inc->options,
      $ctrl->getRoutes(),
      $ctrl->inc->pref,
      $ctrl->post['project'] ?? constant('BBN_PROJECT')
    )
  );
}

return true;