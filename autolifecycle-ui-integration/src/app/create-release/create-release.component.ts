import { Component, OnInit } from '@angular/core';
import { AutoService } from '../auto.service';
import { Router,NavigationEnd  } from '@angular/router';
import { HttpResponse} from '@angular/common/http'; 
declare var jquery:any; // not required
declare var $ :any; // not required


@Component({
  selector: 'app-create-release',
  templateUrl: './create-release.component.html',
  styleUrls: ['./create-release.component.css']
})
export class CreateReleaseComponent implements OnInit {

  constructor(private autoService:AutoService,private router: Router) { 


    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }

   this.router.events.subscribe((evt) => {
    if (evt instanceof NavigationEnd) {
       // trick the Router into believing it's last link wasn't previously loaded
       this.router.navigated = false;
       // if you need to scroll back to top, here is the right place
       window.scrollTo(0, 0);
    }
});
  }
  productList;
  releaseList;
  submited;
  release;
  success_message:boolean=false;
  fail_message:boolean=false;
  status_message;
  sprintsList;
  product_id;
  jira_message="Select the Product to map";
  is_mapped:boolean=false;
  no_sprints:boolean=false;

  selectedFiles: File[]=[];
   selectFile(event) {

    this.selectedFiles = event.target.files;

  }


  productSelected(event){
    this.jira_message="Select the Product to map";
    $('body').loading({
      message: 'Fetching data...'
    });
    this.is_mapped=false;
    this.no_sprints=false;
    this.product_id=event.target.value;
    console.log(this.product_id);
  this.autoService.getAllSprintsFromJira(this.product_id).subscribe(
    data => {
      console.log(data);
     
      // let sprint_obj=JSON.parse(""+data);
      if(data["statusCode"]==1){
        this.is_mapped=true;
        this.sprintsList=data["sprintModel"];
        this.jira_message=data["message"];
        if(this.sprintsList[0].sprintId==0){
            this.no_sprints=true;
        }
      }
      if(data["statusCode"]==2){
          this.is_mapped=false;
         this.jira_message=data["message"];
      }
      console.log(this.is_mapped);
      
    },
    error => {
      $('body').loading('stop');
      console.log('oops', error)
    },
    ()=>{
      $('body').loading('stop');
    }
     
  );

}
  
  getAllReleases(){
    this.autoService.getAllReleases().subscribe(
      data => {
        this.releaseList=data;
      },
      error => console.log('oops', error)
     );
  }

  upload(data) {
      
      
    if(data.ce ==1){
      $('body').loading({
        message: 'Creating ... Release'
      });

      var jira_map = $('#jira_check_box').is(':checked');

      console.log("++++++"+this.selectedFiles,data.Pid,data.Rname,data.Rdesc,data.Idate,data.Edate,jira_map,data.sprint_id);
      if(data.sprint_id==undefined){
        data.sprint_id='';
      }
      this.autoService.addRelease(this.selectedFiles,data.Pid,data.Rname,data.Rdesc,data.Idate,data.Edate,jira_map,data.sprint_id).subscribe(
        event => {
  
       if (event instanceof HttpResponse) {
        console.log(event);

        let release_obj=JSON.parse(""+event.body);
        if(release_obj["statusCode"]==1){
          this.success_message=true;
          this.status_message=release_obj["message"];
          this.fail_message=false;
          this.getAllReleases();
          $('body').loading('stop');
        }
        else{
          this.success_message=false;
          this.status_message=release_obj["message"];
          this.fail_message=true;
          $('body').loading('stop');
        }
        $('#msg').show();
        setTimeout(function(){$('#msg').hide();}, 5000);

  
        }
         
         
        
            
      
  
      });

      this.submited=true;
      
    } 
    if(data.ce ==2){

      
      this.autoService.getReleaseDetailsByRId(data.R_id).subscribe(
        data => {
          
          this.release=data;
          console.log("Release ready");
          console.log(this.release);
        },
        err => {
          console.log("Error occured.");
        },
        () =>{
          var jira_map = $('#jira_check_box2').is(':checked');
          if(data.sprint_id==undefined){
            data.sprint_id='';
          }
          console.log( this.release[0].files,data.P_id,data.R_name,this.release[0].releaseDescription,this.release[0].releaseDateInternal,this.release[0].releaseDateExternal);
          this.autoService.addRelease(this.release[0].files,data.P_id,data.R_name,this.release[0].releaseDescription,this.release[0].releaseDateInternal,this.release[0].releaseDateExternal,jira_map,data.sprint_id).subscribe(
       
            event => {
              
           if (event instanceof HttpResponse) {
            console.log("evvvvv"+event.body);
            let release_obj=JSON.parse(""+event.body);
             
            console.log("sttttt"+release_obj["statusCode"]);
            if(release_obj["statusCode"]==1){
              this.success_message=true;
              this.status_message=release_obj["message"];
              this.fail_message=false;
              this.getAllReleases();
            }
            else{
              this.success_message=false;
              this.status_message=release_obj["message"];
              this.fail_message=true;
            }
            
            $('#msg').show();
            setTimeout(function(){$('#msg').hide();}, 3000);

            }
             
            err => {
              console.log("Error occured.");
            }
      
          });
          
  
        }
      );

      this.submited=true;
    }


    

  }

  ngOnInit() {

    $('input[name="jira_map1"]').click(function(){
      var inputValue = $(this).attr("value");
      $("." + inputValue).toggle();
  });

  $('input[name="jira_map2"]').click(function(){
    var inputValue = $(this).attr("value");
    $("." + inputValue).toggle();
});

  

    this.submited=false;
    this.autoService.getAllProducts().subscribe(
      data => {
        this.productList=data;
      },
      error => console.log('oops', error),
      ()=>{
        const component = this;
        $("div.desc").hide(function() {
          component.is_mapped=false;
           
          $("#release_form select").val("-1");
        }

        );
        $("input[name$='ce']").click(function() {
          var test = $(this).val();
          
           
          console.log($(this).val());
          component.is_mapped=false;
           
          
          $("#release_form")[0].reset();
          $("#release_form select").val("-1");
           
          
          // $("#release_form")[0].reset();
          console.log(component.product_id);
          $("div.desc").hide();
          $("#ce" +test).show();
          

          
      }
    );

    this.getAllReleases();
     
     
       
    //  $("input[value='1']").prop('checked',true);

  });
     

  $(document).on('click', '.browse', function(){
    var file = $(this).parent().parent().parent().find('.file');
    file.trigger('click');
    });
    $(document).on('change', '.file', function(){
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });
   
  
    
  
    $.validate({
      validateOnBlur : true,
      
      
    });
    
    

     
  }

}
