<?php
/**
 * User: BBN
 * Date: 20/07/2017
 * Time: 21:02
 */
 
/** @var \bbn\Mvc\Controller $ctrl The current controller */

$ctrl->setColor('#000', '#FFF')
  ->setIcon('nf nf-fa-home')
  ->combo(_('Help'), [
    'root' => APPUI_IDE_ROOT
  ]);