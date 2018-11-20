$(function(){
	var jqxhr = $.getJSON( "wrongSorting.json", function() {
		// console.log(json);
	})
	.done(function(data) {
		
		let childrenTh = data.filter(function(item) {
			return item['parentId'] != 0;
		});

		let parentsTh = data.filter(function(item) {
			return item['parentId'] == 0;
		});

		function addHtml(item) {
			let htmlTr = "<tr data-id='"+ item['id'] +"' data-active='" + item['isActive'] + "' class='filter-item'>";
			htmlTr += "<th></th><th>" + item['name'] + "</th>";
			htmlTr += "<th>" + item['balance'] + "</th>";
			htmlTr += "<th>" + item['email'] + "</th>";
			htmlTr += "<th>" + item['isActive'] + "</th>";
			htmlTr += "<th>" + item['id'] + "</th>";
			htmlTr += "<th>" + item['parentId'] + "</th>";
			htmlTr += "</tr>";
			return htmlTr;
		}

		$.each( parentsTh, function(i, item ) {			
			$('#table-filter tr:last').after(addHtml(item));
			$('tr[data-id=' + item['id'] +']').attr({
				'data-parentID': item['parentId']
			});
		});

		$.each(childrenTh, function(index, item) {
			$('#table-filter tr[data-id=' + item['parentId'] +']').after(addHtml(item));
			$('tr[data-id=' + item['id'] +']').addClass('hidden child-row');			
			$('tr[data-id=' + item['id'] +']').attr({
				'data-parentID': item['parentId']
			});	
			$('tr[data-id=' + item['parentId'] +'] th:first-child').addClass('extended');			
		});

		$('#table-filter tr').on('click', function() {
			let dataId = $(this).attr('data-id');
			let childrenNode = $('tr[data-parentID=' + dataId +']');
			if (childrenNode.hasClass('hidden')) {
				childrenNode.removeClass('hidden');
				$(this).find('.extended').addClass('open');
			}
			else {
				childrenNode.addClass('hidden');
				$(this).find('.extended').removeClass('open');
				childrenNode.each(function find(i, item){
					$(this).find('.extended').removeClass('open');

					let childDataID = $(item).attr('data-id');
					childrenChildNode = $('tr[data-parentID=' + childDataID +']');
					childrenChildNode.addClass('hidden');
					
					if (childrenChildNode.length != 0) {
						find(0, childrenChildNode);
					}
					else {
						return false;
					}
				})
			}
		});

		$('.filter-field').on('click', function() {
			if(!$('.filter-field').hasClass('filtered')) {
				$('.filter-item').each(function(index, el) {
					if($(this).attr('data-active') == 'true') {
						$(this).addClass('filter-show');					
					}
					else {
						$(this).addClass('filter-hide');	
					}
				});
				$('.filter-field').addClass('filtered');
			}
			else {
				$('.filter-field').removeClass('filtered');
				$('.filter-item').removeClass('filter-hide');	
				$('.filter-item').removeClass('filter-show');					
			}
		});
	})
	.fail(function() {
		//console.log( "error" );
	});
});