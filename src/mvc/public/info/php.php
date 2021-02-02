<?php
$ctrl->obj->title = _("Infos PHP");
$ctrl->obj->icon = "nf nf-mdi-language_php";
$ctrl->obj->content = \bbn\X::hdump(phpinfo());