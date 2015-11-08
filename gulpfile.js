var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "http://localhost:3000"
  });
});

gulp.task('default', ['browser-sync'], function() {
  // เมื่อไฟล์ html หรือ css มีการเปลี่ยนแปลง ก็ให้รีเฟรช web browser
  gulp.watch(['./client/*.html'], browserSync.reload);
});
