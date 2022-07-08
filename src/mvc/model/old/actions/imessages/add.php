<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 22/03/2018
 * Time: 20:07
 *
 * @var $model \bbn\Mvc\Model
 */

if ( !empty($model->data['id_option']) &&
  !empty($model->data['title']) &&
  !empty($model->data['content'])
){
  $imess = new \bbn\Appui\Imessages($model->db);
  if ( $imess->insert($model->data) ){
    return ['success' => true];
  }
}
