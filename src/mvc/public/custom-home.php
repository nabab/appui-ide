<?php

/** @var bbn\Mvc\Controller $ctrl The current controller */

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

if (!empty($ctrl->post)) {
  $ctrl->action();
}
else {
  $ctrl
    ->setColor('teal', 'white')
    ->setIcon('nf nf-md-home_edit bbn-large')
    ->combo("Custom Home", true);
}