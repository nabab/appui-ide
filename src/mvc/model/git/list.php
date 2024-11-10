<?php
/**
 * What is my purpose?
 *
 **/

/** @var bbn\Mvc\Model $model */
use bbn\X;

return $model->getSetFromCache(
  function() use ($model) {
    $start = time() - (30*24*3600);
    $projects = $model->getCachedModel('git/projects', 24*3600);
    /*$projects = ['projects' => [
      [
        'id' => 81,
      ]
    ]];*/
    $res = [];

    // propriétés : ['id_project', 'branch', 'date', 'author', 'author_email', 'short_id', 'id', 'title', 'message', 'url'] | j'appelle le model git/commits si le dernier commit a moins de3 mois.

    foreach($projects['projects'] as $p) {
      $branches = $model->getCachedModel('git/branches', ['id_project' => $p['id']], 24*3600);
      foreach($branches['branches'] as $b) {
        $creation = strtotime($b['commit']['created_at']);
        if ($creation > $start) {
          $commit = $model->getModel('git/commits', ['id_project' => $p['id'], 'branch' => $b['name']], 24*3600);
          foreach ($commit['commits'] as $c) {
            $c_creation = strtotime($c['created_at']);
            if ($c_creation > $start) {
              $res[] = [
                'id_project' => $p['id'],
                'project' => $p['name'],
                'project_url' => $p['web_url'],
                'branch' => $b['name'],
                'date' => date('Y-m-d H:i:s', $c_creation),
                'author' => $c['author_name'],
                'author_email' => $c['author_email'],
                'short_id' => $c['short_id'],
                'id' => $c['id'],
                'title' => $c['title'],
                'message' => $c['message'],
                'url' => $c['web_url']
              ];
            }
          }
        }
        else {
          $res[] = [
            'id_project' => $p['id'],
            'project' => $p['name'],
            'project_url' => $p['web_url'],
            'branch' => $b['name'],
            'date' => date('Y-m-d H:i:s', $creation),
            'author' => $b['commit']['author_name'],
            'author_email' => $b['commit']['author_email'],
            'short_id' => $b['commit']['short_id'],
            'id' => $b['commit']['id'],
            'title' => $b['commit']['title'],
            'message' => $b['commit']['message'],
            'url' => $b['commit']['web_url']
          ];
        }
      }
    }
    $res = X::sortBy($res, 'date', 'desc');
    return [
      'data' => $res,
    ];
  },
  [],
  '',
  3600
);
