<?php
use bbn\Appui\Ide;
use bbn\File\System;

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

if (!isset($ctrl->inc->fs)) {
  $ctrl->addInc('fs',  new System());
}

return true;
