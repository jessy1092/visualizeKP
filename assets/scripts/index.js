$(document).ready(function ()
{
    var kpApiServer = 'http://api.kptaipei.tw/v1/';
    var youtubeApiServer = 'http://gdata.youtube.com/feeds/api/videos/';
    var accessToken = 'kp53f5678ed52da7.75516738';
    var videosList = [];
    var videosTotalViewsCount = 0;

    $('.sidebar').sidebar({overlay: true}).sidebar('toggle');

    updatePlaylist(accessToken);

    function updatePlaylist (accessToken) {
        getPlayList(accessToken, function (playList) {
            // console.log(playList);
            var cheklength = 0;
            playList.data.forEach(function (playListEntry) {
                getVideosList(accessToken, playListEntry, function (videos) {
                    cheklength++;
                    videosList = videosList.concat(videos.data);
                    if (cheklength == playList.data.length) {
                        console.log(videosList);
                        updateVideosCount();
                    }
                });
            });
        });
    }

    function getPlayList (accessToken, getPlayListData) {
        $.ajax({
            type: 'GET',
            url: kpApiServer + 'videos/?accessToken=' + accessToken,
            dataType: 'json'
        }).done(function (playList) {
            // console.log(playList);
            getPlayListData(playList);
        });
    }

    function getVideosList (accessToken, playListEntry, getVideosData) {
        $.ajax({
            type: 'GET',
            url: kpApiServer + 'videos/' + playListEntry.id + '?accessToken=' + accessToken,
            dataType: 'json'
        }).done(function (videos) {
            // console.log(videosList);
            getVideosData(videos);
        });
    }

    function updateVideosCount () {
        videosList.forEach(function (videosEntry) {
            $.ajax({
                type: 'GET',
                url: youtubeApiServer + videosEntry.id + '?alt=json',
                dataType: 'json'
            }).done(function (videosCountData) {
                // console.log(videosCountData);
                videosEntry.viewCount = videosCountData.entry.yt$statistics.viewCount;
                videosEntry.rating = videosCountData.entry.gd$rating.average;
                videosTotalViewsCount += parseInt(videosEntry.viewCount);
                console.log(videosTotalViewsCount);
            })
        })
    }
});

