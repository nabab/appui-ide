<?php


if (!isset($ctrl->inc->fs)) {
  $ctrl->addInc('fs',  new \bbn\File\System());
}

return true;
