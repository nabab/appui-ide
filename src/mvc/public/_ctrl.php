<?php

if (empty($ctrl->baseURL) && $ctrl->hasData('baseURL')) {
  $ctrl->baseURL = $ctrl->data['baseURL'];
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