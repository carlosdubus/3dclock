var Clock3D = function(width,height){
    
    var createLambertMesh = function(geometry,params){              
        var material = new THREE.MeshLambertMaterial( params );
        return new THREE.Mesh( geometry, material );
    }
    
    // scene
    var scene = new THREE.Scene();
    
    // set up the camera
    var camera = new THREE.PerspectiveCamera(48, width/height, 0.1, 1000);
    
    scene.add( camera );
    camera.position.set(0,0,20);
    camera.lookAt(scene.position);

    //renderer
    var renderer = new THREE.WebGLRenderer({

    });
    
    this.renderer = renderer;
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    // renderer.shadowMapDebug = true;
    //renderer.shadowMapSoft = true;
    

    // Create a light, set its position, and add it to the scene.
    var spotLight = new THREE.SpotLight( 0xFFFFFF,1 );
    spotLight.position.set(-15,15,40);
    // allow the light to cast shadow
    spotLight.castShadow=true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    //spotLight.shadowCameraVisible = true;
    
    // I remember playing a lot with these values
    spotLight.shadowCameraNear = 5;
    spotLight.shadowCameraFar = 2000;
    spotLight.shadowCameraFov = 30;

    scene.add( spotLight );

    // allow rotation and zooming with the mouse
    var controls = new THREE.OrbitControls( camera );
    
    
     // plane
    var planeWidth = 200;
    var planeHeight = planeWidth*0.666875;
     var geometry = new THREE.PlaneGeometry(planeWidth ,planeHeight,100,100);
     var material = new THREE.MeshLambertMaterial( { 
        color: 0x444444
     } );
     planeMesh = new THREE.Mesh( geometry, material );
     //planeMesh.position.z=-10;
     planeMesh.receiveShadow=true;
     //planeMesh.castShadow=true;
     scene.add(  planeMesh );

    
    var clockMesh,planeMesh,secondsMesh;

    // base clock white circle
    var geometry = new THREE.CircleGeometry(4.9,30);
    var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
    var circleMesh = new THREE.Mesh( geometry, material );
    circleMesh.position.z=0.01;
    circleMesh.receiveShadow=true;
    scene.add(  circleMesh );

    // glass circle
    var geometry = new THREE.CircleGeometry(4.8,10);
    var material = new THREE.MeshLambertMaterial( { 
        color: 0xFFFFFF,
        depthWrite:true,
        transparent:true,
        opacity:0.15
    } );
    var glassMesh = new THREE.Mesh( geometry, material );
    glassMesh.position.z=0.25;
    glassMesh.receiveShadow=true;
    //planeMesh.castShadow=true;
    scene.add(  glassMesh );

    // seconds hand cilinder
    var cHeight = 5;
    var cRadio = 0.025;
    geometry = new THREE.CylinderGeometry(cRadio,cRadio,cHeight,10);
    material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
    // we move the ce
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, cHeight/4, 0 ) );
    secondsMesh = new THREE.Mesh( geometry, material );
    secondsMesh.position.z=0.15;
    secondsMesh.castShadow=true;
    scene.add(  secondsMesh );

    
    // center black cilinder
    var pivotMesh = createLambertMesh(new THREE.CylinderGeometry(0.3,0.3,0.3,100),{color:0x111111});
    pivotMesh.rotation.x+=90*Math.PI/180;
    pivotMesh.position.z=0;
    pivotMesh.castShadow=true;
    scene.add(  pivotMesh );

    // center red cilinder
    pivotMesh = createLambertMesh(new THREE.CylinderGeometry(0.18,0.18,0.15,100),{color:0xFF0000});
    pivotMesh.rotation.x+=90*Math.PI/180;
    pivotMesh.position.z=0.1;
     pivotMesh.castShadow=true;
    scene.add(  pivotMesh );

    var hoursHeight = 2.2;
    var geometry = new THREE.CubeGeometry(0.15,hoursHeight,0.15);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, hoursHeight/2, 0 ) );
    var hoursMesh = createLambertMesh(geometry,{color:0x111111});
    hoursMesh.castShadow=true;
    scene.add(  hoursMesh );

    var minutesHeight = 3.2;
    var geometry = new THREE.CubeGeometry(0.15,minutesHeight,0.08);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, minutesHeight/2, 0 ) );
    var minutesMesh = createLambertMesh(geometry,{color:0x111111});
    minutesMesh.position.z=0.09;
     minutesMesh.castShadow=true;
    scene.add(  minutesMesh );


    // clock
    var loader = new THREE.JSONLoader();
    loader.load( "models/clock.js", function ( geometry, materials ) {
        var material = new THREE.MeshLambertMaterial( { color: 0x111111 } );
        //var material = new THREE.MeshFaceMaterial( materials );
        clockMesh = new THREE.Mesh( geometry, material );
        clockMesh.position.z = 0.25;
        clockMesh.castShadow=true;
        scene.add( clockMesh );



    } );




    var createHourLabel = function(hour){
       var hourLabelPivot = new THREE.Object3D();
        scene.add(hourLabelPivot);
        var geometry = new THREE.CubeGeometry(0.15,0.3,0.08);
        //geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, minutesHeight/2, 0 ) );
        var mesh = createLambertMesh(geometry,{color:0x999999});
        mesh.position.y=4.2;
        mesh.receiveShadow=true;
        //mesh.castShadow=true;
        hourLabelPivot.add(  mesh );
        hourLabelPivot.rotation.z=-hour*30*Math.PI/180;;
    }

    for(var i = 0;i<12;i++){
        createHourLabel(i);
    }

    var currentSeconds=false,secondsChangedTime=0,renderClock;

    this.render = function () {
        if(!renderClock){
            renderClock = new THREE.Clock();
            renderClock.start();
        }
        var seconds = this.seconds;
        var minutes = this.minutes+(seconds/60);
        var hours = this.hours+(minutes/60);
        
        secondsMesh.rotation.z=-seconds*6*Math.PI/180;
        minutesMesh.rotation.z=-minutes*6*Math.PI/180;
        hoursMesh.rotation.z=-hours*30*Math.PI/180;
        
        // we rotate the seconds hands according to the oscilate function to appear more realistic, elapsedTime - secondsChngaedTime is the number of seconds since the seconds hand moved
        secondsMesh.rotation.z+=oscilate(renderClock.getElapsedTime()-secondsChangedTime);

        renderer.render(scene, camera);

       if(currentSeconds!==false && seconds != currentSeconds){
            secondsChangedTime = renderClock.getElapsedTime();
            
        }

        currentSeconds = seconds;

    };
    
    
    var tickaudio = new Audio('sounds/tick.wav');
    tickaudio.volume = 0.5;
    this.tick = tickaudio;

    var secondsElapsed =0;
    
    var addTime = function(time){

        secondsElapsed += time;
        var newSeconds = parseInt(secondsElapsed);
        var timeChanged = false;
        if(newSeconds != this.seconds){
            timeChanged = true;  
        }
        
        this.seconds = newSeconds;
        if(this.seconds >= 60){
            secondsElapsed = 0;
            this.seconds = 0;
            this.minutes++;
        }
        if(this.minutes >= 60){
            this.minutes = 0;
            this.hours++;
        }
        if(this.hours >= 24){
            this.hours = 0;
        }
        
        if(timeChanged){
            this.onTimeChange();
            tickaudio.play();
            
        }
    };
    
    this.start = function(){
        var self = this;
        var clock = new THREE.Clock();
        clock.start();
        secondsElapsed = this.seconds;
        var loop = function () {      
            addTime.apply(self,[clock.getDelta()]);
            self.render();
            
            requestAnimationFrame(loop);
        };
        
        loop();
    };
    
    /**
     * function to oscilate the seconds hand until stop, to simulate real movement
     * @param t time in seconds
     */
    var oscilate = function(t){
        return Math.exp(20*-t)*Math.sin(15*t*Math.PI)*(5*Math.PI/180);
    };
};

Clock3D.prototype = {
    seconds:0,
    minutes:0,
    hours:0,
    renderer:null,
    tick:null,
    onTimeChange:function(){}
};