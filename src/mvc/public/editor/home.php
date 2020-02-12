<?php
/**
 * User: BBN
 * Date: 20/07/2017
 * Time: 21:02
 */
 
/** @var \bbn\mvc\controller $ctrl The current controller */

$ctrl->set_color('#000', '#FFF')
  ->set_icon('nf nf-fa-home')
  ->combo(_('Help'), [
    'root' => APPUI_IDE_ROOT
  ]);