<?php
$success = false;
if(
    !empty($ctrl->post['node']['fpath']) && 
    !empty($ctrl->post['node']['item']) &&
	!empty($ctrl->post['node']['file']) &&
	!empty($ctrl->post['content'])
){
	$content = $ctrl->post['content'];
	$id_project = $ctrl->post['id_project'] ?? $ctrl->inc->options->fromCode(BBN_APP_NAME, 'list', 'project', 'appui');
  $project = new \bbn\Appui\Project($ctrl->db, $id_project);
	$fs = new \bbn\File\System();
	$fn = 'get_'.$ctrl->post['node']['fpath'].'_path';
	if (method_exists($project, $fn)
     && ($root = $project->$fn($ctrl->post['node']['fpath']))
  ) {
		$full_path  = $root.$ctrl->post['node']['item'];
		if ( $fs->isFile($full_path) ){
			$success = $fs->putContents($full_path, $content);
		}
	}
}
$ctrl->obj->success = $success;
