<?php
/*
 * Describe what it does!
 *
 **/
/*
die(var_dump(
  $src,
  $fav,
  $ctrl->inc->pref->getAll($src),
  $ctrl->inc->pref->delete('cc0ac989c3a111e99668366237393031'),
  $ctrl->inc->pref->makePublic('0171f410c37d11e99668366237393031'),
  ($usr = $ctrl->db->selectOne('bbn_users', 'id', [], [], 5)),
  $ctrl->db->update('bbn_users_options', ['id_user' => $ctrl->inc->user->getId()], ['id' => '0171f410c37d11e99668366237393031']),
  $ctrl->inc->pref->getByOption($src),
  $ctrl->inc->pref->retrieveIds($src),
  $ctrl->inc->pref->retrieveUserIds($src),
  $ctrl->inc->pref->retrieveGroupIds($src),
));
*/

/** @var $this \bbn\Mvc\Controller */
if ( isset($ctrl->post['data'], $ctrl->post['data']['path'])) {
  $ctrl->addData($ctrl->post['data'])->action();
}
else{
  $ctrl->setColor('#35BCFA', '#FFF')
    ->setUrl($ctrl->pluginUrl('appui-ide').'/finder')
    ->setIcon('nf nf-mdi-apple_finder bbn-large')
    ->combo('Finder', true);
}