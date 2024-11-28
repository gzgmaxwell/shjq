
/// 数字/下划线/点
export const checkUsernameTypeEN = (rule, value, callback)=>{
    //正则表达式
    var reg = new RegExp("^[0-9-_/.]+$");
    if(!reg.test(value)){
      callback(new Error('请输入数字、点和下划线'))
    }else{
      callback()
     }
    }
export const checkUrl = (rule, value, callback)=>{
    var reg = new RegExp("[a-zA-z]+://[^\s]*");
    if(value == ''){
        callback()
    }else if(!reg.test(value)){
      callback(new Error('请输入正确的链接'))
    }else{
      callback()
     }
    }

export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    refreshBtn: false,
    showClomnuBtn: false,
    searchMenuSpan: 6,
    searchSize: 'mini',
    labelWidth:170,
    refreshBtn:false,
    emptyBtnText:'重置',
    menuWidth:150,
    editBtn: false,
    delBtn: false,
    column: [{
        label: '版本',
        prop: 'version',
        dataType: 'Number',
        type: 'number',
        controls:false,
        precision:0,
        minRows:0,
        rules: [{
            required: true,
            message: '请输入版本',
            trigger: 'blur'
        }],
    },
    {
        label: '官方版本号',
        prop: 'versionOfficial',
        type: 'input',
        sortable:true,
        rules: [{
            required: true,
            message: '请输入官方版本号',
            trigger: 'blur'
        },{ validator: checkUsernameTypeEN, trigger: 'blur' }],
        search: true,
        searchLabelWidth: '90'
    },{
        label: '平台(ANDROID/IOS)',
        prop: 'platform',
        type: 'select',
        dicData:[
            {
                label: 'ANDROID',
                value: 'ANDROID',
            },
            {
                label: 'IOS',
                value: 'IOS',
            },
        ],
        rules: [{
            required: true,
            message: '请选择平台',
            trigger: 'blur'
        }],
    },{
        label: '是否强制更新',
        prop: 'forceUpdate',
        type: 'select',
        dicData:[
            {
                label: 'YES',
                value: 'YES',
            },
            {
                label: 'NO',
                value: 'NO',
            },
        ],
        rules: [{
            required: true,
            message: '请选择是否强制更新',
            trigger: 'blur'
        }],
    },{
        label: '更新内容',
        prop: 'updateContent',
        span:24,
        rules: [{
            required: true,
            message: '请输入更新内容',
            trigger: 'blur'
        }],
    },{
        label: '热更新包',
        prop: 'hotFileName',
        slot: true,
        span:24,
    },{
        label: '全量包',
        prop: 'apkFileName',
        slot: true,
        span:24,
    }, {
        width: 150,
        label: '创建时间',
        prop: 'createTime',
        type: 'datetime',
        sortable:true,
        addDisplay: false,
        editDisplay: false,
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },{
        width: 150,
        label: '更新时间',
        prop: 'updateTime',
        type: 'datetime',
        sortable:true,
        addDisplay: false,
        editDisplay: false,
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },]
}
