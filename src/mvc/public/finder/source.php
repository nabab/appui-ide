<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\controller */
if ( isset($ctrl->arguments[0]) ){
  $ctrl->add_data(['id' => $ctrl->arguments[0]])
    ->set_url($ctrl->plugin_url('appui-ide').'finder/source/'.$id)
    ->combo('$text', true);
}