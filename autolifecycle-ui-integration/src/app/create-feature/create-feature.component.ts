import { Component, OnInit } from '@angular/core';
import { AutoService } from '../auto.service';
import { Router,NavigationEnd  } from '@angular/router';
import { HttpResponse} from '@angular/common/http'; 
declare var jquery:any; // not required
declare var $ :any; // not required

@Component({
  selector: 'app-create-feature',
  templateUrl: './create-feature.component.html',
  styleUrls: ['./create-feature.component.css']
})
export class CreateFeatureComponent implements OnInit {

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
  feature_types;
  products_list;
  release_list;
  release_id;
  product_id;
  type_id;
  success_message:boolean=false;
  fail_message:boolean=false;
  status_message;
  selectedFiles: File[]=[];
  issue_list;
  jira_message="Select the Type";
  is_mapped:boolean=false;
  no_issues:boolean=false;
  selectFile(event) {

   this.selectedFiles = event.target.files;

 }
  productSelected(event){
   this.product_id=event.target.value;
   this.is_mapped=false;
    
    this.jira_message="Select the Type";
    $("#select_type").val("-1");
    this.getReleasesByProduct(this.product_id);
  }
  typeSelected(event){
     
   this.no_issues=false;
    $('body').loading({
      message: 'Fetching data...'
    });
    this.type_id=event.target.value;
      this.autoService.getAllIssuesBytype(this.release_id,this.type_id).subscribe(
        data => {
          console.log(data);
          if(data["statusCode"]==1){
            this.is_mapped=true;
            this.issue_list=data;
            this.jira_message=data["message"];
        if(this.issue_list.backLogsModel[0].issueid==0){
            this.no_issues=true;
        }
          }
          if(data["statusCode"]==2){
              this.is_mapped=false;
             this.jira_message=data["message"];
          }
          console.log(this.is_mapped);

            
          
        },
  
        error =>{
          console.log('oops', error),
          $('body').loading('stop');
        },
        ()=>{
          $('body').loading('stop');
        }
         
      );
   }
   releaseSelected(event){
    this.release_id=event.target.value;
    this.is_mapped=false;
    this.jira_message="Select the Type";
    $("#select_type").val("-1");
      
   }

  getReleasesByProduct(pId){
    this.autoService.getReleaseListByPId(pId).subscribe(
      data => {
        
        this.release_list=data;
        this.release_id=this.release_list[0].releaseId;
         
        
      },

      error => console.log('oops', error),
      ()=>{
        
      }
       
    );
  }
  
  onCreate(data){
    $('body').loading({
      message: 'Creating ... Feature'
    });
    var jira_map = $('#jira_check_box').is(':checked');
    if(data.issue_id==undefined){
      data.issue_id='';
    }
    this.release_id=$("#release_id").val();
    console.log("Feature+++:"+this.selectedFiles,data.feature_name,data.feature_description,this.product_id,data.story_points,data.feature_type_id,this.release_id,jira_map,data.issue_id);
    this.autoService.addFeature(this.selectedFiles,data.feature_name,data.feature_description,this.product_id,data.story_points,data.feature_type_id,this.release_id,jira_map,data.issue_id).subscribe(
      event => {

     if (event instanceof HttpResponse) {
      console.log(event);
      console.log(data.url,data.user_name,data.password);
      let release_obj=JSON.parse(""+event.body);
      if(release_obj["statusCode"]==1){
        this.success_message=true;
        this.status_message=release_obj["message"];
        this.fail_message=false;
        $('body').loading('stop');
      }
      else{
        this.success_message=false;
        this.status_message=release_obj["message"];
        this.fail_message=true;
        $('body').loading('stop');
      }
      $('#msg').show();
setTimeout(function(){$('#msg').hide();}, 3000);


      }
       
       
      
          
    

    });

  }

  ngOnInit() {

    $('input[type="checkbox"]').click(function(){
      var inputValue = $(this).attr("value");
      $("." + inputValue).toggle();
  });

    this.autoService.getAllProducts().subscribe(
      data => {
        
        this.products_list=data;
        this.product_id=this.products_list[0].product_id;
        
      },

      error => console.log('oops', error),
      ()=>{

        this.getReleasesByProduct(this.product_id);


      }
       
    );

    
    
    this.autoService.getAllFeaturesTypes().subscribe(
      data => {
        
        this.feature_types=data;
         
        
      },

      error => console.log('oops', error),
      ()=>{
        
      }
       
    );
    
  }

}
