import type { BaseDeptEntity } from "@/types/base";
import type { SimpleTree } from "../system/type";
import type { UploadFileResult } from "../files/type";
import type { string } from "vue-types";



/*****************biz_样机****************** */
export interface TrainMachine extends BaseDeptEntity {

   id?: number,

   deptId: string,

   code: string,

   title: string,

   leader: string,

   telNumber: string,

   ipV4: string,

   ipV6: string,

   status: string,

   optionsParams: {},

}

export interface TrainMachineHealth {

   id: number,

   macCode: string,

   runStatus: string,

   openTime: Date,

   closeTime: Date,

   optionsParam: {}

}

/*****************biz_警员**** */
export interface PoliceInfo extends BaseDeptEntity {
   id?: number,

   code: string,

   name: string,

   idNo: string,

   category: string,

   position: string,

   remark: string,

   optionsParams: object,

   status: string
}

/****************biz_警情 */
export interface TrainVideo extends Omit<BaseDeptEntity, "optionsParams"> {
   id?: number,

   code: string,

   name: string,

   thumb: string,

   trainType: string,

   trainLevel: string,

   status: string,

   sortValue: number

   optionsParams?: TrainVideoParams
}


export interface TrainVideoParams {
   gunLocalUrl: string,
   /**
* 开始帧率
*/
   fpsStartTime: string,
   /**
* 结束帧率
*/
   fpsEndTime: string,
   /**
* 默认使用毫秒 1000
*/
   videoTime: number,
   /**
* 动作开始毫秒
*/
   playTime: number,
   /**
* 开始执法记录仪
*/
   closeCamera: number
   /**
* 开启警官证
*/
   openPoliceCard: number,
}

export interface TrainVideoChild extends SimpleTree<TrainVideoChild> {

   /**
  * 关联主表
  */
   trainId: string

   /**
    * 警情名称
    */
   name: string

   /**
    */
   realType: string

   /**
    * 跳转依据
    */
   switchType: string

   /**
    * 视频路径
    */
   path: Array<UploadFileResult>
}


export interface TrainRecord {

   id?: number

   trainVideoId?: number

   trainTaskId?: number

   policeIdNo: string,

   screenShot: string,

   trainVideo: string,

   trainTime?: Date

   uploadTime?: Date

   uploadIp?: string

   hasTrain: boolean,

   uploadClientVersion: string

   optionsParams?: Map<string, object>,

   createDept?: string

}

export interface TrainPlan extends Omit<BaseDeptEntity, 'updateDept'> {
   /**
   * 编号
   */
   id?: number


   /**
    * 名称
    */
   name: string

   /**
    * 训练类型 normal 正常 setup 分步
    */
   planType: string
   /**
    * 同上级id集合
    */
   planIds: Array<number>

   /**
    * 上传文件集合
    */
   uploadFiles: Array<number>

   /**
    * 扩展字段
    */
   optionsParams: {}

   /**
    * 训练开始时间
    */
   startTime?: Date

   /**
    * 训练结束时间
    */
   endTime?: Date

   /**
    * 备注
    */
   remark?: string


}