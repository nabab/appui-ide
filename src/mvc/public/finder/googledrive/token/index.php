<?php
if (!empty($ctrl->get['code'])) {
  echo $ctrl->getView([
    'code' => $ctrl->get['code']
  ]);
}