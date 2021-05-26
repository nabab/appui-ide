<?php
/**
 * User: BBN
 * Date: 20/07/2017
 * Time: 21:02
 */
 
/** @var \bbn\Mvc\Controller $ctrl The current controller */

$ctrl->setColor('#000', '#FFF')
  ->setIcon('nf nf-fa-home')
  ->setTitle(_('Help'));
$html = $ctrl->customPluginView('editor/help', 'html', [], 'appui-ide');
echo $html ?: $ctrl->getView();
