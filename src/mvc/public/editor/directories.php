<?php
  $ctrl->obj->url = APPUI_IDE_ROOT.'editor/directories';
  $ctrl->obj->data = $ctrl->get_model();
  $ctrl->obj->data['root'] = APPUI_IDE_ROOT;
  $ctrl->combo("Manager Directories", $ctrl->obj);
