import { Injectable } from '@angular/core';
import { HttpClient ,HttpRequest,HttpEvent,HttpErrorResponse} from '@angular/common/http'; 
import {  } from '@angular/http'; 

declare var jquery:any; // not required
declare var $ :any; // not required

import {ProductLine,Product,Release} from './profile/profile.component';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';



@Injectable()
export class AutoService {

  constructor(private http: HttpClient) { }

  serviceUrl="http://192.168.50.35:8084";

  getAllProductLines(): Observable<ProductLine> {
    return this.http.get<ProductLine>(this.serviceUrl+"/productline/getAll");
  }

  getAllProducts(): Observable<Product> {
    return this.http.get<Product>(this.serviceUrl+"/product/getAll" );
  }
  
  getAllReleases(): Observable<Release> {
    return this.http.get<Release>(this.serviceUrl+"/releases/getAllReleases" );
  }
  getAllFeaturesByReleaseId(RId) {
    return this.http.get(this.serviceUrl+"/features/getDetails?fkReleaseId="+RId);
  }
  getAllProductLineLogos(PLId) {
    return this.serviceUrl+"/productlinelogo/imageViewer?fk_product_line_id="+PLId  ;
  } 

  getProductNameByPLId(plId): Observable<ProductLine> {
    return this.http.get<ProductLine>(this.serviceUrl+"/productline/getNamesbyId?product_line_id="+plId);
  }

  getProductDetailsByPId(pId):Observable<Product> {
    return this.http.get<Product>(this.serviceUrl+"/product/getProductDetails?product_id="+pId);
  }
  getReleaseListByPId(pId)  {
    return this.http.get(this.serviceUrl+"/product/getDetails?product_id="+pId);
  }

  getReleaseDetailsByRId(rId):Observable<Release> {
    return this.http.get<Release>(this.serviceUrl+"/releases/getDetails?releaseId="+rId);
  }

  getReleasePhasesByRId(RId) {
    return this.http.get(this.serviceUrl+"/releasephases/getAllReleasephasesByReleaseId?fkrelease_id="+RId);
  }
  getJiraDetailsByUserId(user_Id) {
    return this.http.get(this.serviceUrl+"/jira/jiracredentialsofuser?fk_user_id="+user_Id);
  }
  getAllFeaturesTypes() {
    return this.http.get(this.serviceUrl+"/features/getAllFeaturesType");
  }
  getAllFeaturesStatus() {
    return this.http.get(this.serviceUrl+"/features/getAllFeaturesStatus");
  }
  getFeatureDetailsbyFId(featureId) {
    return this.http.get(this.serviceUrl+"/features/getDetailsByFeatureId?featureId="+featureId);
  }
  getAllBacklogs(product_id) {
    return this.http.get(this.serviceUrl+"/features/getFeaturesIsbacklogOneByfkProductId?fk_product_id="+product_id);
  }
  getAllUsers() {
    return this.http.get(this.serviceUrl+"/user/getAll");
  }
  getAllBacklogsByProductId(product_id) {
    return this.http.get(this.serviceUrl+"/jira/getbacklogsofboardbyproductid?fk_user_id=1&product_id="+product_id);
  }
  getAllIssuesByReleaseId(release_id){
    return this.http.get(this.serviceUrl+"/jira/getissuesofsprintbyproductreleaseId?fk_user_id=1&release_Id="+release_id);
  }
  getAllBoardsFromJira(user_id){
    return this.http.get(this.serviceUrl+"/jira/listofunassignedboards?fk_user_id="+user_id);
  }
  getAllSprintsFromJira(product_id){
    return this.http.get(this.serviceUrl+"/jira/listofunassignedsprintsofboard?fk_user_id=1&product_id="+product_id);
  }
  getAllIssuesBytype(release_id,type_id){
    return this.http.get(this.serviceUrl+"/jira/listofunassignedissues?fk_user_id=1&release_Id="+release_id+"&fk_feature_type_id="+type_id);
    
  }
  getMappedProducts(){
    return this.http.get(this.serviceUrl+"/product/getAllmapedProducts");
  }
  
  getUnMappedProducts(){
    return this.http.get(this.serviceUrl+"/product/getAllUnmapedProducts");
  }
  getMappedReleases(){
    return this.http.get(this.serviceUrl+"/jira/mappedReleasesList");
  }
  
  getUnMappedReleases(){
    return this.http.get(this.serviceUrl+"/jira/unMappedReleasesList");
  }
  getMappedFeatures(){
    return this.http.get(this.serviceUrl+"/features/getAllMapedFeatures");
  }
  
  getUnMappedFeatures(){
    return this.http.get(this.serviceUrl+"/features/getAllUnMapedFeatures");
  }


   
  

  addProductLine(file: File[],plname,pldesc): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('product_line_name', plname);
    formdata.append('product_line_desc', pldesc);
    const req = new HttpRequest('POST', this.serviceUrl+"/productline/create", formdata, {
      reportProgress: true,
    }
    );
    return this.http.request(req);
  }



  addProduct(file: File[],plid,pname,pdesc,jira_map,board_id): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_product_line', plid);
    formdata.append('product_name', pname);
    formdata.append('product_desc', pdesc);
    

    formdata.append('jira_map', jira_map);
    formdata.append('board_id', board_id);
    formdata.append('fk_user_id', "1");
     
    
   

    const req = new HttpRequest('POST', this.serviceUrl+"/product/create", formdata, {
      reportProgress: true,
    }
    );
    console.log(req);
    return this.http.request(req);
  }


  updateProduct(file: File[],plid,pid,pname,pdesc): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
   
    formdata.append('product_id', pid);
    formdata.append('product_name', pname);
    formdata.append('product_desc', pdesc);
    formdata.append('fk_product_line', plid);
    formdata.append('fk_product_owner', "1");

     
     
    const req = new HttpRequest('POST', this.serviceUrl+"/product/update", formdata, {
      reportProgress: true,
    }
    );
    return this.http.request(req);
  }




  addReleasePhase(file: File[],release_id,release_phase_name,release_phase_desc,start_date,end_date): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_release_id', release_id);
    formdata.append('release_phase_name', release_phase_name);
    formdata.append('release_phase_description', release_phase_desc);
  
    formdata.append('start_date', start_date);
    formdata.append('end_date', end_date);
     
    const req = new HttpRequest('POST', this.serviceUrl+"/releasephases/createphase", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );


     console.log(req.body);
    return this.http.request(req);
    
    
  }

  updateReleasePhase(file: File[],release_phase_id,release_id,release_phase_name,release_phase_desc,start_date,end_date): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_release_id', release_id);
    formdata.append('release_phase_id', release_phase_id);
    formdata.append('release_phase_name', release_phase_name);
    formdata.append('release_phase_description', release_phase_desc);
  
    formdata.append('start_date', start_date);
    formdata.append('end_date', end_date);
     
    const req = new HttpRequest('POST', this.serviceUrl+"/releasephases/updatephase", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );


     console.log(req.body);
    return this.http.request(req);
    
    
  }

  updateMilestone(file: File[],release_phase_id,release_id,release_phase_name,release_phase_desc,end_date): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_release_id', release_id);
    formdata.append('release_phase_id', release_phase_id);
    formdata.append('release_phase_name', release_phase_name);
    formdata.append('release_phase_description', release_phase_desc);
  
     
    formdata.append('end_date', end_date);
     
    const req = new HttpRequest('POST', this.serviceUrl+"/releasephases/updatemilestone", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );


     console.log(req.body);
    return this.http.request(req);
    
    
  }
  addMilestone(file: File[],release_id,release_phase_name,release_phase_desc,end_date): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_release_id', release_id);
    formdata.append('release_phase_name', release_phase_name);
    formdata.append('release_phase_description', release_phase_desc);
  
     
    formdata.append('end_date', end_date);
     
    const req = new HttpRequest('POST', this.serviceUrl+"/releasephases/createmilestone", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );


     console.log(req.body);
    return this.http.request(req);
    
    
  }

  addRelease(file: File[],product_id,release_name,release_desc,internal_date,external_date,jira_map,sprint_id): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fkProductId', product_id);
    formdata.append('releaseName', release_name);
    formdata.append('releaseDesc', release_desc);
    // formdata.append('fkReleaseOwner', "1");
    formdata.append('internalReleaseDate', internal_date);
    formdata.append('externalReleaseDate', external_date);
    formdata.append('fkStatusId', "1");
    formdata.append('jira_map', jira_map);
    formdata.append('fk_user_id', "1");
    formdata.append('sprint_id', sprint_id);

    const req = new HttpRequest('POST', this.serviceUrl+"/releases/create", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );


     console.log(req.body);
    return this.http.request(req);
    
    
  }


  updateRelease(file: File[],product_id,release_id,release_name,release_desc,internal_date,external_date): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fkProductId', product_id);
    formdata.append('releaseId', release_id);
    formdata.append('releaseName', release_name);
    formdata.append('releaseDesc', release_desc);
    formdata.append('fkReleaseOwner', "1");
    formdata.append('internalReleaseDate', internal_date);
    formdata.append('externalReleaseDate', external_date);
    formdata.append('fkStatusId', "1");
   
    const req = new HttpRequest('POST', this.serviceUrl+"/releases/update", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );

    console.log(req);
    return this.http.request(req);
    
    
  }


  updateReleasestatus(file: File[],product_id,release_id,release_name,release_desc,internal_date,external_date,status): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fkProductId', product_id);
    formdata.append('releaseId', release_id);
    formdata.append('releaseName', release_name);
    formdata.append('releaseDesc', release_desc);
    formdata.append('fkReleaseOwner', "1");
    formdata.append('internalReleaseDate', internal_date);
    formdata.append('externalReleaseDate', external_date);
    formdata.append('fkStatusId', status);
   
    const req = new HttpRequest('POST', this.serviceUrl+"/releases/update", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );

    console.log(req);
    return this.http.request(req);
    
    
  }


  deleteRelease(release_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('releaseId', release_id);
    const req = new HttpRequest('POST', this.serviceUrl+"/releases/delete", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }

  deleteProduct(product_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('product_id', product_id);
    const req = new HttpRequest('POST', this.serviceUrl+"/product/delete", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }

  deleteProductAttachment(product_id,attachment_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('fkProductId', product_id);
    formdata.append('fileId', attachment_id);
    const req = new HttpRequest('POST', this.serviceUrl+"/product/deleteproductfiles", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }


  deleteReleaseAttachment(release_id,attachment_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('fkReleaseId', release_id);
    formdata.append('fileId', attachment_id);
    const req = new HttpRequest('POST', this.serviceUrl+"/releases/deleteReleaseFiles", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }
   
  configureWithJira(url,user_name,password):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    
    formdata.append('url', url);
    formdata.append('username', user_name);
    formdata.append('password', password);
    formdata.append('fk_user_id',"1"  );
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/addcredentials", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }


  updateJira(jira_configuration_id,url,user_name,password):Observable<HttpEvent<{}>> {
    console.log("from service:" ,jira_configuration_id,url,user_name,password)
    const formdata: FormData = new FormData();
    
    formdata.append('jira_configuration_id', jira_configuration_id);
    formdata.append('url', url);
    formdata.append('username', user_name);
    formdata.append('password', password);
    formdata.append('fk_user_id',"1"  );
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/updatecredentials", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }


  addFeature(file: File[],feature_name,feature_description,fk_product_id,story_points,fk_feature_type_id,fk_release_id,jira_map,issue_id): Observable<HttpEvent<{}>> {
    console.log(feature_name,feature_description,fk_product_id,story_points,fk_feature_type_id,fk_release_id,jira_map,issue_id);
    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_release_id', fk_release_id);
    formdata.append('fk_product_id', fk_product_id);
    formdata.append('fk_feature_type_id', fk_feature_type_id);
    formdata.append('feature_name', feature_name);               
    formdata.append('jira_map',jira_map);
    formdata.append('fk_user_id',"1");         
    formdata.append('issue_id',issue_id);
    formdata.append('feature_description',feature_description);
    formdata.append('story_points',story_points);
     
    const req = new HttpRequest('POST', this.serviceUrl+"/features/create", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );

 
    return this.http.request(req);
    
    
  }


  updateFeature(file: File[],feature_name,feature_id,feature_description,story_points,fk_feature_type_id,fk_release_id,fk_feature_status_id): Observable<HttpEvent<{}>> {

    const formdata: FormData = new FormData();
    let fileList=file.length;
    while(fileList>=0){
      formdata.append('files', file[fileList]);
      fileList--;
    }
    formdata.append('fk_release_id', fk_release_id);
    formdata.append('feature_id', feature_id);
    formdata.append('fk_feature_status_id', fk_feature_status_id);
    formdata.append('assigned_To', "2");
    formdata.append('fk_feature_type_id', fk_feature_type_id);
    formdata.append('feature_name', feature_name);
  
    formdata.append('feature_description',feature_description);
    formdata.append('story_points',story_points);
     
    const req = new HttpRequest('POST', this.serviceUrl+"/features/update", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
    );

 
    return this.http.request(req);
    
    
  }

  deleteFeature(feature_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('feature_id',feature_id);
    const req = new HttpRequest('POST', this.serviceUrl+"/features/delete", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }

  importBacklogsFromJira(product_id,listofIssueIds):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('product_id',product_id);
    formdata.append('listofIssueIds',listofIssueIds);
    formdata.append('fk_user_id',"1");
    
 
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/importbacklogsofboardtoauto", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
    return this.http.request(req);
  }

  syncProductFromAutoToJira(product_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('productId',product_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/syncProductAutoToJira", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }

  syncProductFromJiraToAuto(product_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('product_id',product_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/syncJiraBoardToAutoProduct", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }

  syncReleaseFromAutoToJira(release_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('releaseId',release_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/syncReleaseAutoToJira", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }

  syncFeatureFromJiraToAuto(feature_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('feature_id',feature_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/syncJiraIssueToAutoFeature", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }
  
  syncFeatureFromAutoToJira(feature_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('featureId',feature_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/syncFeatureAutoToJira", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }
  syncReleaseFromJiraToAuto(release_id,product_id):Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('release_id',release_id);
    formdata.append('product_id',product_id);
    
    
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/syncJiraSprintToAutoRelease", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }
  

  mapProductwithJira(product_id,board_id):Observable<HttpEvent<{}>> {
    console.log(product_id,board_id);
    const formdata: FormData = new FormData();
    formdata.append('product_id',product_id);
    formdata.append('boardId',board_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/assignjiraboardtoautolifecycleproduct", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }

  mapReleasewithJira(product_id,sprint_id,release_Id):Observable<HttpEvent<{}>> {
    console.log(product_id,release_Id,sprint_id);
    const formdata: FormData = new FormData();
    formdata.append('product_id',product_id);
    formdata.append('release_Id',release_Id);
    formdata.append('sprintId',sprint_id);

    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/assignjirasprinttoautolifecyclerelease", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }

  mapFeaturewithJira(feature_Id,issue_id):Observable<HttpEvent<{}>> {
    

    const formdata: FormData = new FormData();
    formdata.append('feature_Id',feature_Id);
    formdata.append('issueId',issue_id);
    formdata.append('fk_user_id',"1");
    const req = new HttpRequest('POST', this.serviceUrl+"/jira/assignissuetoautofeature", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }


  moveFeatureToBacklog(feature_Id,fk_release_id):Observable<HttpEvent<{}>> {
    

    const formdata: FormData = new FormData();
    formdata.append('feature_id',feature_Id);
    formdata.append('fk_release_id',fk_release_id);
    
     
    const req = new HttpRequest('POST', this.serviceUrl+"/features/movetoBackLogOne", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }
  
  moveBacklogToFeature(feature_Id,fk_release_id):Observable<HttpEvent<{}>> {
    

    const formdata: FormData = new FormData();
    formdata.append('feature_id',feature_Id);
    formdata.append('fk_release_id',fk_release_id);
    
     
    const req = new HttpRequest('POST', this.serviceUrl+"/features/movetoBackLogZero", formdata, {
      reportProgress: true,

      responseType: 'text'
    }
  );
     
    return this.http.request(req);
  }

   


}
