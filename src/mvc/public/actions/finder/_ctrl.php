fs->getCurrent()<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Controller */

if ( isset($ctrl->post['origin']) && ($p = $ctrl->inc->pref->get($ctrl->post['origin'])) ){
  $fields = ['path', 'host', 'user', 'pass'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($p[$f]) ){
      $cfg[$f] = $p[$f];
    }
  }
  
	$ctrl->addInc('fs', new \bbn\File\System($p['type'], $cfg));
  if ( !empty($cfg['path']) ){
    $ctrl->inc->fs->cd($cfg['path']);
  }
}