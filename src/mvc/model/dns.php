<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

if ($model->hasData("method")) {
  $data = [
    'success' => false
  ];
  switch ($model->data['method']) {
    case 'dns_get_record':
      if ($model->hasData("hostname") && Str::isDomain($model->data['hostname'])) {
        try {
          if ($data['result'] = dns_get_record($model->data['hostname'], DNS_ANY)) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
    case 'checkdnsrr':
      if ($model->hasData("hostname") && Str::isDomain($model->data['hostname'])) {
        if ($model->hasData("type")) {
          try {
            if ($data['result'] = checkdnsrr($model->data['hostname'], $model->data['type'])) {
              $data['success'] = true;
            }
          }
          catch(Exception $e) {
            $data['error'] = $e->getMessage();
          }
        }
      }
      break;
    case 'gethostbyname':
      if ($model->hasData("hostname") && Str::isDomain($model->data['hostname'])) {
        try {
          if ($data['result'] = gethostbyname($model->data['hostname'])) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
    case 'gethostbynamel':
      if ($model->hasData("hostname") && Str::isDomain($model->data['hostname'])) {
        try {
          if ($data['result'] = gethostbynamel($model->data['hostname'])) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
    case 'gethostname':
      try {
        if ($data['result'] = gethostname()) {
          $data['success'] = true;
        }
      }
      catch(Exception $e) {
        $data['error'] = $e->getMessage();
      }
      break;
    case 'gethostbyaddr':
      if ($model->hasData("ip") && Str::isDomain($model->data['ip'])) {
        try {
          if ($data['result'] = gethostbyaddr($model->data['ip'])) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
    case 'ip2long':
      if ($model->hasData("ip") && Str::isDomain($model->data['ip'])) {
        try {
          if ($data['result'] = ip2long($model->data['ip'])) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
    case 'long2ip':
      if ($model->hasData("ip") && Str::isInteger($model->data['ip'])) {
        try {
          $ip = (int) $model->data['ip'];
          if ($data['result'] = long2ip($ip)) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
    case 'checkportopen':
      if ($model->hasData("port") && Str::isInteger($model->data['port'])) {
        if ($model->hasData("hostname")  && Str::isDomain($model->data['hostname'])) {
          try {
            $port = (int) $model->data['port'];
            $conn = fsockopen($model->data['hostname'], $port, $errno, $errstr, 10);
            if($conn) {
              $data['result'] = true;
              $data['success'] = true;
              fclose($conn);
            }
            else {
              $data['result'] = false;
              $data['success'] = true;
            }
          }
          catch(Exception $e) {
            $data['error'] = $e->getMessage();
          }
        }
      }
      break;
    case 'getservbyport':
      if ($model->hasData("port") && Str::isInteger($model->data['port'])) {
        if ($model->hasData("protocol")) {
          try {
            $port = (int) $model->data['port'];
            if ($data['result'] = getservbyport($port, $model->data['protocol'])) {
              $data['success'] = true;
            }
          }
          catch(Exception $e) {
            $data['error'] = $e->getMessage();
          }
        }
      }
      break;
    case 'net_get_interfaces':
      try {
        if ($data['result'] = net_get_interfaces()) {
          $data['success'] = true;
        }
      }
      catch(Exception $e) {
        $data['error'] = $e->getMessage();
      }
      break;
    case 'getprotobyname':
      if ($model->hasData("protocol")) {
        try {
          if ($data['result'] = getprotobyname($model->data['protocol'])) {
            $data['success'] = true;
          }
        }
        catch(Exception $e) {
          $data['error'] = $e->getMessage();
        }
      }
      break;
  }
  return $data;
}
else {
  $net_interfaces_info = net_get_interfaces();
  $interfaces = array_keys($net_interfaces_info);
  $net_render = [];
  foreach ($interfaces as $interface)  {
    $data = $net_interfaces_info[$interface];
    if ($data['unicast'] && sizeof($data['unicast']) == 3 && $data['up']) {
      $sub_arr = [];
      array_push($sub_arr, $interface, $data['unicast'][1]['address'], $data['unicast'][1]['netmask'], $data['unicast'][2]['address'], $data['unicast'][2]['netmask'], $data['up']);
      array_push($net_render, $sub_arr);
    }
  }
  return [
    "hostname" => gethostname(),
    "net_interfaces_info" => $net_interfaces_info,
    "net_render" => $net_render
  ];
}