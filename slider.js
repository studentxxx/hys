/*
* @Author: huang yansheng
* @Date:   2017-01-04 19:44:48
* @Last Modified by:   Administrator
* @Last Modified time: 2017-01-17 11:46:56
*/
function slider ( obj ) {
	var ul = null;
	if( obj.box === null ) {
		return false;
	}
	if( obj.srcList === null ) {
		return false;
	}
	var box = obj.box;
	var width = box.offsetWidth;
	var height = box.offsetHeight;
	//声明一个记录当前所在页面的变量index
	var index = 0;

	setCss ( box , {
		overflow : 'hidden',
		position : 'relative'
	} );
	
	//若box下有ul标签 则将其当做图片的容器 若没有则创建一个
	if( ul = box.getElementsByTagName( 'ul' )[0] ) {
	} else {
		ul = box.appendChild( document.createElement( 'ul' ) );
	}

	//记录轮播图图片个数，并根据个数设置ul容器的样式
	var length = obj.srcList.length;
	setCss ( ul , {
		width : ( length + 2 ) * width + 'px',
		height : height + 'px',
		position : 'absolute',
		top: '0px',
		left: '-' + width + 'px'
	} );

	//根据是否传入hrefList生成相应的结构，并将其加入到ul中
	var html = '';
	if( obj.hrefList ) {
		for(var i=0;i<length;i++){
			html += '<li style="height:'+height+'px; width:'+width+'px; float:left;"><a href="'+obj.hrefList[i]+'"><img style="width:100%;height:100%;" src="'+obj.srcList[i]+'"/></a></li>';
		}
	} else {
		for(var i=0;i<length;i++){
			html += '<li style="height:'+height+'px; width:'+width+'px; float:left;"><img style="width:100%;height:100%;" src="'+obj.srcList[i]+'"/></li>';
		}
	}
	ul.innerHTML = html;

	//创建左右翻页的按钮，并将其加入到box中
	var arrow = cE( 'ul' , {
		className : 'arrow',
		css:{display:'none'}
	} );
	var left = cE( 'a' , {
		innerHTML:'&lt;',
		href:'javascript:;',
		className:'left',
		css: {
			width: '6%',
			height: '24%',
			backgroundColor:'rgb(0,0,0)',
			color: 'white',
			textAlign: 'center',
			lineHeight: .24 * height + 'px',
			position: 'absolute',
			left: '0px',
			top: '50%',
			marginTop: '-' + .12 * height + 'px'
		}
	} );
	var right = cE( 'a' , {
		innerHTML:'&gt;',
		href:'javascript:;',
		css: {
			width: '6%',
			height: '24%',
			backgroundColor:'rgb(0,0,0)',
			color: 'white',
			textAlign: 'center',
			lineHeight: .24 * height + 'px',
			position: 'absolute',
			right: '0px',
			top: '50%',
			marginTop: '-' + .12 * height + 'px'
		}
	} );
	arrow.appendChild( left );
	arrow.appendChild( right );
	box.appendChild( arrow );

	var dotList = cE( 'ul' , {
		css: {
			position: 'absolute',
			bottom: '10px'
		}
	} )
	var dotHTML = '';
	for(var i=0;i<length;i++){
		if( i === 0  ) {
			dotHTML += '<li style ="float:left; width:20px; height:20px; line-height:20px; text-align:center; border-radius:50%; margin-right:5px; background-color:red; color:white; cursor:pointer;">' + ( i + 1 ) + '</li>';
		} else {
			dotHTML += '<li style ="float:left; width:20px; height:20px; line-height:20px; text-align:center; border-radius:50%; margin-right:5px; background-color:#000; color:white; cursor:pointer;">' + ( i + 1 ) + '</li>';
		}
	}
	dotList.innerHTML = dotHTML;
	box.appendChild( dotList );
	var dot = dotList.getElementsByTagName( 'li' );

	//克隆节点 实现无缝轮播
	var last = ul.lastChild;
	ul.appendChild( ul.children[0].cloneNode( true ) );
	ul.insertBefore( last.cloneNode( true ) , ul.children[0]  );

	//实现左右按钮翻页 并添加节流阀
	var mark = true;
	arrow.onclick = function ( event ) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		if ( mark ) {
			mark = false;
			if( target === left ) {
				index--;
			} else if( target === right ) {
				index++;
			}
			animate( ul , {
				'left': '-' + ( index + 1 ) * width + 'px'
			} , function() {
				if( index === -1 ) {
					index = length - 1;
					ul.style.left = '-' + length * width + 'px';
				} else if( index === length ) {
					index = 0;
					ul.style.left = '-' + width + 'px';
				}
				setDot( index );
				mark = true;
			} )
		}
	};

	//调整自动轮播速度
	var playSpeed = obj.autoPlay;
	playSpeed = playSpeed < 1500 ? 1500 : playSpeed;
	if( typeof playSpeed === 'string' ) {
		if( playSpeed === 'fast' ) {
			playSpeed = 1500;
		} else if( playSpeed === 'mid' ) {
			playSpeed = 3000;
		} else if( playSpeed === 'slow' ) {
			playSpeed = 4500;
		} else {
			playSpeed = undefined;
		}
	}

	//实现鼠标移入box 左右按钮显示,停止自动轮播定时器 移出隐藏,并开启自动轮播定时器
	box.onmouseover = function () {
		arrow.style.display = 'block';
		if( obj.autoPlay && obj.autoPlay !== 'off' ) {
			clearInterval( slider.timer );
		}
	};
	box.onmouseout = function () {
		arrow.style.display = 'none';
		if( obj.autoPlay && obj.autoPlay !== 'off' ) {
			slider.timer = setInterval( autoPlay , playSpeed );
		}
	};

	//实现点击dot翻到制定页面
	dotList.onclick = function ( event ) {
		var event = event || window.event;
		var target = event.target || event.srcElement;
		if( mark && event.target.nodeName === 'LI' ) {
			mark = false;
			index = target.innerHTML - 1;
			setDot( index );
			animate( ul , {
				left: '-' + ( index + 1 ) * width + 'px'
			} ,function () {
				mark = true;
			})
		}
	};

	//实现自动翻页
	if( obj.autoPlay && obj.autoPlay !== 'off' ) {
		slider.timer = setInterval( autoPlay , playSpeed );
	}

	//若obj.touch属性为on 实现移动端的滑动翻页
	if( obj.touch === 'on' ) {
		var start = 0,
			current = 0,
			isMove = false,
			sleft = 0;
		arrow.parentNode.removeChild( arrow );
		dotList.onclick = function(){};
		box.addEventListener( 'touchstart' , function ( event ) {
			clearInterval( slider.timer );
			start = event.touches[0].clientX;
			current = start;
			isMove = false;
			sLeft = ul.offsetLeft;
		} );
		box.addEventListener( 'touchmove' , function ( event ) {
			isMove = true;
			current = event.touches[0].clientX;
			ul.style.left = sLeft + current - start + 'px';
		} )
		box.addEventListener( 'touchend' , function ( event ) {
			var dis = current - start;
			if( isMove ) {
				if( Math.abs( dis ) < width / 3 ) {
					animate( ul , { left: sLeft + 'px' } ,function(){
						slider.timer = setInterval( autoPlay , playSpeed );
					} );
				} else {
					dis > 0 ? index-- : index++;
					animate( ul , {
						'left': '-' + ( index + 1 ) * width + 'px'
					} , function() {
						if( index === -1 ) {
							index = length - 1;
							ul.style.left = '-' + length * width + 'px';
						} else if( index === length ) {
							index = 0;
							ul.style.left = -width + 'px';
						}
						setDot( index );
						slider.timer = setInterval( autoPlay , playSpeed );
					} )
				}
			};
		} )
	};


	function autoPlay () {
		index++;
		animate( ul , {
				'left': '-' + ( index + 1 ) * width + 'px'
			} , function() {
				if( index === -1 ) {
					index = length - 1;
					ul.style.left = '-' + length * width + 'px';
				} else if( index === length ) {
					index = 0;
					ul.style.left = '-' + width + 'px';
				}
				setDot( index );
		} );
	};
	function setDot( which ) {
		for( var i=0;i<dot.length;i++ ) {
			dot[i].style.backgroundColor = '#fff';
			dot[i].style.backgroundColor = '#000';
		}
		dot[ which ].style.backgroundColor = 'red';
		dot[ which ].style.color = 'white';
	};
	function animate ( ele , json , callback ) {
		clearInterval( ele.timer );
		ele.timer = setInterval( function(){
			var flag = true;
			for ( var k in json ) {
				if( k === 'opacity' ) {
					var current = getStyle( ele , k ) * 100;
					var target = json[ k ] * 100;
					var speed = ( target - current ) / 10;
					speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
					ele.style[ k ] = ( current + speed ) / 100;
				} else if( k === 'zIndex' ) {
					ele.style[ k ] = json[ k ];
				} else {
					var current = parseInt( getStyle( ele , k ) );
					var target = parseInt( json[ k ] );
					var speed = ( target - current ) / 10;
					speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
					ele.style[ k ] = current + speed + 'px';
				}
			}
			if( current !== target ) {
				flag = false;
			}
			if( flag ) {
				clearInterval( ele.timer );
				if( callback ) {
					callback();
				}
			}
		} , 15 )
	};
	function getStyle ( ele , attr ) {
		if( window.getComputedStyle ) {
			return window.getComputedStyle( ele , null )[ attr ];
		} else {
			return ele.currentStyle[ attr ];
		}
	};
	function cE ( tag , attr ) {
		var that = document.createElement( tag );
		if( attr ) {
			for ( var k in attr ) {
				if ( k === 'css' ) {
					for ( var style in attr[ k ] ) {
						that.style[ style ] = attr[ k ][ style ];
					}
				}
				that[ k ] = attr[ k ];
			}
		}
		return that;
	};
	function setCss( ele , css ) {
		for ( var k in css ) {
			ele.style[ k ] = css[ k ];
		}
	};

	//提供自定义dot样式的方法
	slider.setDotCss = function ( css ) {
		if( css.ul ) {
			setCss( dotList , css.ul );
		};
		if( css.li ) {
			for( var i=0;i<dot.length;i++ ) {
				setCss( dot[ i ] , css.li );
			}
		};
	};

	//提供自定义左右按钮样式的方法
	slider.setArrowCss = function ( css ) {
		if( css.left ) {
			setCss( left , css.left );
		};
	  	if( css.right )	{
	  		setCss( right , css.right );
	  	};
	};
}