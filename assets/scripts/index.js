$(document).ready(function ()
{
    var accessToken = 'kp53f5678ed52da7.75516738';
    var videosList = [];

    $('.sidebar').sidebar({overlay: true}).sidebar('toggle');

    $.ajax({
        type: 'GET',
        url: 'http://api.kptaipei.tw/v1/videos/?accessToken=' + accessToken,
        dataType: 'json'
    }).done(function (playList) {
        // console.log(playList);
        playList.data.forEach(function (playListEntry) {
            $.ajax({
                type: 'GET',
                url: 'http://api.kptaipei.tw/v1/videos/' + playListEntry.id + '?accessToken=' + accessToken,
                dataType: 'json'
            }).done(function (videos) {
                videosList = videosList.concat(videos.data);
                // console.log(videosList);
            });
        });
    });

});
