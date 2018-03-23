<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 22/03/2018
 * Time: 20:07
 *
 * @var $model \bbn\mvc\model
 */

if ( !empty($model->data['id_option']) &&
  !empty($model->data['title']) &&
  !empty($model->data['content'])
){
  $imess = new \bbn\appui\imessages($model->db);
  if ( $imess->insert($model->data) ){
    return ['success' => true];
  }
}