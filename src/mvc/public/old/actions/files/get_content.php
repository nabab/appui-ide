<?php
$success = false;
if(
    !empty($ctrl->post['fpath']) &&
    !empty($ctrl->post['item']) &&
    !empty($ctrl->post['file'])
){
	$id_project = $ctrl->post['id_project'] ?? $ctrl->inc->options->fromCode(BBN_APP_NAME, 'list', 'project', 'appui');
  $project = new \bbn\Appui\Project($ctrl->db, $id_project);
	$fs = new \bbn\File\System();
	$fn = 'get_'.$ctrl->post['fpath'].'_path';
	if (method_exists($project, $fn)
     && ($root = $project->$fn())
  ) {
		$full_path  = $root.$ctrl->post['item'];
		if ( $fs->isFile($full_path) ){
			if ($content = file_get_contents($full_path)){
				$success = true;
				$ctrl->obj->content = $content;
				$ctrl->obj->extension = pathinfo($full_path, PATHINFO_EXTENSION);
			};
		}
	}
}
$ctrl->obj->success = $success;