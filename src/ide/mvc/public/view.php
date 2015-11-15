<?php
$old_path = getcwd();
chdir(BBN_ROOT_PATH);
if ( count($this->params) > 2 ){
	$p = array_slice($this->params, 2);
	$file = implode('/', $p);
	echo $file;
	if ( file_exists($file) ){
		global $bbn;
		if ( strpos(basename($file),'.') === false ){
			$this->obj->ext = '';
		}
		else{
			$this->obj->ext = strtolower(substr($file,strrpos($file,'.')+1));
		}
		if ( in_array($this->obj->ext,$bbn->vars['viewable']) )
		{
			$this->obj->file = basename($file);
			switch ( $this->obj->ext )
			{
				default:
					$this->obj->code = file_get_contents($file,TRUE);
					break;
				/*
				case 'php':
					$this->obj->code = file_get_contents($file,TRUE);
					$this->obj->code .= print_r(token_get_all($o->code),1);
					break;
				*/
			}
		}
	}
}
else{
	echo "Fichier incorrect !";
}
chdir($old_path);
