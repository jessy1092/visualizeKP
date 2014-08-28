$(document).ready(function ()
{
    var kpApiServer = 'http://api.kptaipei.tw/v1/';
    var youtubeApiServer = 'http://gdata.youtube.com/feeds/api/videos/';
    var accessToken = 'kp53f5678ed52da7.75516738';
    var videosList = [];
    var videosTotalViewsCount = 0;

    $('.sidebar').sidebar({overlay: true}).sidebar('toggle');

    updatePlaylist(accessToken);

    $('a[href^="#"]').bind('click.smoothscroll', function (e) {
        e.preventDefault();
        target = this.hash;
        $('html, body').stop().animate({
            'scrollTop': $(target).offset().top,
        }, 900, 'swing', function () {
             window.location.hash = target;
        });
    });

    $('.item').on('click', function () {
        $('.item').removeClass('active');
        $(this).addClass('active');
    })

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
        var cheklength = 0;
        videosList.forEach(function (videosEntry) {
            $.ajax({
                type: 'GET',
                url: youtubeApiServer + videosEntry.id + '?alt=json',
                dataType: 'json'
            }).done(function (videosCountData) {
                cheklength++;
                // console.log(videosCountData);
                videosEntry.viewCount = parseInt(videosCountData.entry.yt$statistics.viewCount);
                videosEntry.rating = videosCountData.entry.gd$rating.average;
                videosTotalViewsCount += videosEntry.viewCount;
                // console.log(videosTotalViewsCount);
                if (cheklength == videosList.length)
                {
                    $('.totalViewsCnt').text(videosTotalViewsCount);
                    d3ViewVideosCountVisual();
                }
            })
        })
    }

    function d3ViewVideosCountVisual () {
        var max = 0;
        var min = 9999999;

        var dataNode = {
            children: videosList.map(function (entry) {
                max = max > entry.viewCount ? max : entry.viewCount;
                min = min < entry.viewCount ? min : entry.viewCount;
                console.log(entry.viewCount);
                return {
                    value: entry.viewCount,
                    videosEntry: entry
                };
            })
        };

        var d3Pack = d3.layout.pack().sort(function (a, b) { return b.value - a.value; })
                        .size([680, 680]).padding(20).nodes(dataNode);

        d3Pack.shift();
        console.log(d3Pack);
        var colorScale = d3.scale.linear().domain([min, max]).range(['#0aa', '#0a5']);

        var dataPack = d3.select('.videosCount').selectAll('circle.pack').data(d3Pack);

        dataPack.enter().append('circle').attr('class', 'pack');

        d3.select('.videosCount').selectAll('circle.pack').attr({
            cx: function (d) { return d.x; },
            cy: function (d) { return d.y; },
            r: function (d) { return d.r; },
            fill: function (d) { return colorScale(d.value); },
            stroke: '#fff'
        });
    }
});

