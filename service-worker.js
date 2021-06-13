var link = '';

self.addEventListener('fetch', function (e) { });

self.addEventListener('push', function (e) {
    var opt = e.data.json();

    var exploreAction = opt.actions.find(x => x.action === 'explore');
    if (exploreAction)
        link = exploreAction.link;

    e.waitUntil(
        self.registration.showNotification(opt.title, opt)
    );
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var action = e.action;
    switch (action) {
    case 'close':
        notification.close();
        break;
    case 'explore':
        clients.openWindow(link);
        link = '';
        notification.close();
        break;
    default:
        notification.close();
    }
});