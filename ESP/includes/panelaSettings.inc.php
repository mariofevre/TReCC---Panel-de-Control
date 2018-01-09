<?php
//*********************************************************
//************ ApplicationSettings ************************
//*********************************************************
class ApplicationSettings	{
	
	var $DATABASE_HOST;
	var $DATABASE_NAME;
	var $DATABASE_USERNAME;
	var $DATABASE_PASSWORD;	
	
	// The constructor Will Set the values
	function ApplicationSettings()
	{
		$this->DATABASE_HOST = '192.168.0.244';
		$this->DATABASE_NAME = 'paneles';
		$this->DATABASE_USERNAME = 'panelista';
		$this->DATABASE_PASSWORD = 'cartondetv';
	}
}
?>
