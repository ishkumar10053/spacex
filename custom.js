$(window).on('load',function(){
	var urlString = getUrlVars();
	var year = '';
	var launch = '';
	var land = '';
	
	if(urlString.land_success){
		land = urlString.land_success;
	}
	if(urlString.launch_year){
		year = urlString.launch_year;
	}
	if(urlString.launch_success){
		launch = urlString.launch_success;
	}
	$('.launch-button button').each(function() {
		if($(this).attr('data-value') == urlString.launch_success){
			$(this).attr('data-select','true');
			$(this).removeClass('button-not-select');
			$(this).addClass('button-select');
		}
	});
	$('.land-button button').each(function() {
		if($(this).attr('data-value') == urlString.land_success){
			$(this).attr('data-select','true');
			$(this).removeClass('button-not-select');
			$(this).addClass('button-select');
		}
	});
	$('.year-button button').each(function() {
		if($(this).attr('data-value') == year){
			$(this).attr('data-select','true');
			$(this).removeClass('button-not-select');
			$(this).addClass('button-select');
		}
	});
	callFunction('load',year,launch,land);
})

function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars[hash[0]] = hash[1];
	}
	return vars;
}

$('button').on('click',function(){
	var year = '';
	var launch = '';
	var land = '';
	var mode = $(this).parent('div').parent('div').attr('data-mode');
	var value = $(this).attr('data-value');
	if(mode == 'year'){
		year = value;
		$('.launch-button button').each(function() {
			if($(this).attr('data-select') == 'true'){
				launch = $(this).attr('data-value')
			}
		});
		$('.land-button button').each(function() {
			if($(this).attr('data-select') == 'true'){
				land = $(this).attr('data-value')
			}
		});
	}
	if(mode == 'launch'){
		launch = value;
		$('.year-button button').each(function() {
			if($(this).attr('data-select') == 'true'){
				year = $(this).attr('data-value')
			}
		});
		$('.land-button button').each(function() {
			if($(this).attr('data-select') == 'true'){
				land = $(this).attr('data-value')
			}
		});
	}
	if(mode == 'land'){
		land = value;
		$('.launch-button button').each(function() {
			if($(this).attr('data-select') == 'true'){
				launch = $(this).attr('data-value')
			}
		});
		$('.year-button button').each(function() {
			if($(this).attr('data-select') == 'true'){
				year = $(this).attr('data-value')
			}
		});
	}
	var isSelect = $(this).attr('data-select');
	$(this).parent('div').parent('div').children('div').children('button').attr('data-select','false');
	$(this).parent('div').parent('div').children('div').children('button').removeClass('button-select');
	$(this).parent('div').parent('div').children('div').children('button').addClass('button-not-select');
	if(isSelect == 'false'){
		$(this).attr('data-select','true');
		$(this).removeClass('button-not-select');
		$(this).addClass('button-select');
	}else{
		$(this).removeClass('button-select');
		$(this).addClass('button-not-select');
		$(this).attr('data-select','false');
		if(mode == 'launch'){
			launch = '';
		}else if(mode == 'land'){
			land = '';
		}else if(mode == 'year'){
			year = '';
		}
	}
	callFunction('',year,launch,land);
})

var currentRequest = null;
function callFunction(method,year,launch,land){
	var url = 'https://api.spacexdata.com/v3/launches?limit=100';
	if(year != '' || launch != '' || land != ''){
		url += '&';
	}
	if(year != ''){
		url += 'launch_year='+year;
		if(launch != '' || land != ''){
			url += '&';
		}
	}
	if(launch != ''){
		url += 'launch_success='+launch;
		if(land != ''){
			url += '&';
		}
	}
	if(land != ''){
		url += 'land_success='+land;
	}
	if(method != 'load'){
		if(url.split('?')[1].replace('limit=100','') == ''){
			window.history.pushState("", "", window.location.href.split("?")[0]);
		}else{
			window.history.pushState("", "", "?"+url.split('?')[1].replace('limit=100&',''));
		}
	}
	$('.inner-result').html('');
	currentRequest = $.ajax({
		type:'GET',
		url:url,
		beforeSend:function(){
			$('.inner-result').html('<h3 style="text-align: center;margin-top: 50px;">Loading...</h3>');
			if(currentRequest != null){
				currentRequest.abort();
			}
		},
		success:function(response){
			var total = response.length;
			if(total > 0){
				htm = '';
				for(var i=0;i<total;i++){
					htm += '<div class="inner-result-single-div"><div class="data-single-box"><div class="image-section"><img alt="'+response[i].mission_name+'" title="'+response[i].mission_name+'" src="'+response[i].links.mission_patch+'"></div><h3>'+response[i].mission_name+' #'+(i+1)+'</h3><p><b>Mission Ids : </b>'+response[i].mission_id+'</p><p><b>Launch Year : </b>'+response[i].launch_year+'</p><p><b>Successful Launch : </b>'+response[i].launch_success+'</p><p><b>Successful Landing : </b>'+response[i].rocket.first_stage.cores[0].land_success+'</p></div><div class="clearfix"></div></div>';
				}
				$('.inner-result').html(htm);
			}else{
				$('.inner-result').html('<h3 style="text-align: center;margin-top: 50px;">No Record Found</h3>');
			}
		},
		error:function(e){
			$('.inner-result').html('Try Again!');
		}
	})
}
