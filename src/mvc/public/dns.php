<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Controller */
//$ctrl->setColor('orange', 'white')->combo(_('DNS Utilities'));

$types = ['A', 'MX', 'NS', 'SOA', 'PTR', 'CNAME', 'AAAA', 'A6', 'SRV', 'NAPTR', 'TXT', 'ANY'];
$host = 'bbn.io';
$host2 = 'cloudmin.bbn.io';
$ip = '51.15.0.236';
$mx = [];
$weight = [];
$recs = [];
$add = [];
var_dump(
  'checkdnsrr',
  checkdnsrr($host, 'ANY'),
  'dns_get_record',
  dns_get_record($host, 'A', $recs, $add),
  $recs,
  $add,
  'gethostbyaddr',
  gethostbyaddr($ip),
  'gethostbyname',
  gethostbyname($host),
  'gethostbynamel',
  gethostbynamel($host),
  'gethostname',
  gethostname(),
  'getmxrr',
  getmxrr($host2, $mx, $weight),
  $mx,
  $weight,
  'getservbyport',
	getservbyport(53, 'udp')
  );