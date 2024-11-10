<?php

/** @var bbn\Mvc\Model $model */

$tmp = ['issues' => []];


if (!empty($tmp)) {
  $result = $tmp['issues'];
}
else {
  $api_repos = "https://gitea.bbn.so/api/v1/user/repos?token=";
  $token = "";
  $result = []; 
  $repositories = json_decode(file_get_contents($api_repos.$token), true);

  $states = ['opened', 'closed'];
  foreach ( $repositories as $repos ){
    if ($repos['has_issues']) {
      foreach ($states as $type) {
        $page = 1;
        while ( $page > 0 ){
          $api_issues = 'https://gitea.bbn.so/api/v1/repos/';
          if ( $type == 'opened' ){
            $api_issues .= $repos['full_name'].'/issues?state=opened&page='.$page.'&token='.$token;
          }
          else{
            $api_issues .= $repos['full_name'].'/issues?state=closed&page='.$page.'&token='.$token; 
          }

          $repositorie = file_get_contents($api_issues);
          $issues = json_decode($repositorie, true);
          if ( !empty($issues) && is_array($issues) && (count($issues) > 0) ){
            foreach ( $issues as &$issue ){            
              $issue['repository'] = $repos['full_name'];
              $result[] = $issue;  
            }
            $page++;
          }
          else{
            $page = 0;
          }
        }      
      }    
    }
  }
}
foreach ($result as $i => $r) {
  $result[$i]['created_at'] = date('Y-m-d H:i:s', strtotime($r['created_at']));
  $result[$i]['updated_at'] = date('Y-m-d H:i:s', strtotime($r['updated_at']));
  if ($r['closed_at']) {
    $result[$i]['closed_at'] = date('Y-m-d H:i:s', strtotime($r['closed_at']));
  }
}

return ['issues' => $result];
