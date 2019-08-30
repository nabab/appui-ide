<?php
/*
 * Describe what it does!
 *
 **/
/*
die(var_dump(
  $src,
  $fav,
  $ctrl->inc->pref->get_all($src),
  $ctrl->inc->pref->delete('cc0ac989c3a111e99668366237393031'),
  $ctrl->inc->pref->make_public('0171f410c37d11e99668366237393031'),
  ($usr = $ctrl->db->select_one('bbn_users', 'id', [], [], 5)),
  $ctrl->db->update('bbn_users_options', ['id_user' => $ctrl->inc->user->get_id()], ['id' => '0171f410c37d11e99668366237393031']),
  $ctrl->inc->pref->get_by_option($src),
  $ctrl->inc->pref->retrieve_ids($src),
  $ctrl->inc->pref->retrieve_user_ids($src),
  $ctrl->inc->pref->retrieve_group_ids($src),
));
*/

/** @var $this \bbn\mvc\controller */
if ( isset($ctrl->post['path']) ){
  $ctrl->action();
}
else{
  $ctrl->set_color('#35BCFA', '#FFF')
    ->set_url($ctrl->plugin_url('appui-ide').'/finder')
    ->set_icon('nf nf-mdi-apple_finder bbn-large')
    ->combo('Finder', true);
}