<?php
$success = false;
if(
    !empty($ctrl->post['fpath']) &&
    !empty($ctrl->post['item']) &&
    !empty($ctrl->post['file'])
){
	$id_project = $ctrl->post['id_project'] ?? $ctrl->inc->options->from_code(BBN_APP_NAME, 'list', 'project', 'appui');
  $project = new \bbn\appui\project($ctrl->db, $id_project);
	$fs = new \bbn\file\system();
	$fn = 'get_'.$ctrl->post['fpath'].'_path';
	if (method_exists($project, $fn)
     && ($root = $project->$fn())
  ) {
		$full_path  = $root.$ctrl->post['item'];
		if ( $fs->is_file($full_path) ){
			if ($content = file_get_contents($full_path)){
				$success = true;
				$ctrl->obj->content = $content;
				$ctrl->obj->extension = pathinfo($full_path, PATHINFO_EXTENSION);
			};
		}
	}
}
$ctrl->obj->success = $success;