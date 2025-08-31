<?php
// Importing required namespaces and classes.
use bbn\X;
use bbn\Str;
use bbn\File\System;
use bbn\Appui\Project;

/** @var bbn\Mvc\Model $model */

// The URL example provided serves as a reference to understand the context.
// example of url: lib/appui-ide/mvc/editor/actions/rename

// Check if the model has the necessary data.
$res = ['success' => false];
if ($model->hasData(['url', 'id_project'])) {

  // Initialization.
  $count = 0;  // Counter for the number of deletions.

  // Create a new project instance.
  $project = new Project($model->db, $model->data['id_project']);
  $fs = new System();  // Filesystem instance.
  $cfg = $project->urlToConfig($model->data['url']);  // Convert the URL to the associated configuration.
  
  // Parse the file path from the configuration.
  $arr_path = X::split($cfg['file'], '/');
  $file = array_pop($arr_path);  // Get the file name.
  $path = X::join($arr_path, '/');  // Get the directory path.

  // Check if the file type is MVC.
  if ($cfg['typology'] && $cfg['typology']['code'] === 'mvc') {
    foreach ($cfg['typology']['tabs'] as $tab) {
      if ($model->data['data']['folder']) {
        $check = str_replace($model->data['data']['uid'], "", $cfg['file']);
        $check = $check . '/' . $tab['path'] . $model->data['data']['uid'];
        $check = str_replace('//', '/', $check);
        // If it's a directory, delete it.
        if ($fs->isDir($check)) {
          $fs->delete($check);
          $count++;
        }
      } else {
        foreach ($tab['extensions'] as $extension) {
          $check = str_replace($model->data['data']['uid'], "", $cfg['file']);
          if (!empty($tab['fixed'])) {
            continue;
            // The following code is unreachable due to the continue statement above.
            $check = $check . '/' . $tab['path'] . str_replace($model->data['data']['name'], "", $model->data['data']['uid']) . $tab['fixed'];
          } else {
            $check = $check . '/' . $tab['path'] . $model->data['data']['uid'] . '.' . $extension['ext'];
          }
          $check = str_replace('//', '/', $check);
          // If it's a file, delete it.
          if ($fs->isFile($check)) {
            $fs->delete($check);
            $count++;
          }
        }
      }
    }
  } else { // This block handles non-MVC type files.

    // If it's supposed to be a folder...
    if ($model->data['data']['folder']) {
      // Check if the directory exists.
      if ($fs->isDir($cfg['file'])) {
        // If the directory exists, delete it.
        $fs->delete($cfg['file']);
        $count++; // Increment the deletion counter.
      }

    } elseif (!empty($cfg['typology'])) { // If it's not a folder (i.e., it's a file)...

      // Loop through the file typologies.
      foreach ($cfg['typology']['tabs'] ?? [] as $tab) {
        // Loop through file extensions associated with the typology.
        foreach ($tab['extensions'] as $extension) {
          // Construct the complete file path.
          $check = $path . '/' . $file . '.' . $extension['ext'];

          // Check if the file exists.
          if ($fs->isFile($check)) {
            // If the file exists, delete it.
            $fs->delete($check);
            $count++; // Increment the deletion counter.
          }
        }
      }

      if (!$fs->getNumFiles($path)) {
        $fs->delete($path);
        $count++;
      }
    }
  }

  // At the end of all operations, return a success status. 
  // The operation is considered successful if at least one file or directory was deleted (i.e., count > 0).
  return [
    'success' => $count > 0
  ];
}

return $res;
