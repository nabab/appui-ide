<?php

/** @var $this \bbn\Mvc\Controller */

if ( isset($ctrl->post['origin']) && ($p = $ctrl->inc->pref->get($ctrl->post['origin'])) ){
  $fields = ['path', 'host', 'user', 'type'];
  $cfg = [];
  foreach ( $fields as $f ){
    if ( isset($p[$f]) ){
      $cfg[$f] = $p[$f];
    }
  }
  if ($cfg['type'] !== 'local') {
  	$pwd = new bbn\Appui\Passwords($ctrl->db);
  	$cfg['pass'] = $pwd->userGet($p['id'], $ctrl->inc->user);
  }
  $fs = new \bbn\File\System($cfg['type'], $cfg);
  if ( !empty($cfg['path']) ){
    $fs->cd($cfg['path']);
  }
  $ctrl->addInc('finderfs', $fs);
}