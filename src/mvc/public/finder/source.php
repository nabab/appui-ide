<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Controller */
if ( isset($ctrl->arguments[0]) ){
  $ctrl->addData(['id' => $ctrl->arguments[0]])
    ->setUrl($ctrl->pluginUrl('appui-ide').'finder/source/'.$ctrl->arguments[0])
    ->combo('$text', true);
}