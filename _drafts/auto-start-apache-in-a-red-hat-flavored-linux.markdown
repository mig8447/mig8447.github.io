# /usr/lib/systemd/system/httpd.service
```
[Unit]
Description=The Apache HTTP Server
After=network.target remote-fs.target nss-lookup.target
Documentation=man:httpd(8)
Documentation=man:apachectl(8)

[Service]
#Type=notify
Type=forking
EnvironmentFile=/etc/sysconfig/httpd
#ExecStart=/usr/sbin/httpd $OPTIONS -DFOREGROUND
ExecStart=/scratch/mimisanc/software/apache/bin/httpd $OPTIONS -k start
#ExecStart=/scratch/mimisanc/software/apache/bin/httpd $OPTIONS -DFOREGROUND
#ExecReload=/usr/sbin/httpd $OPTIONS -k graceful
ExecReload=/scratch/mimisanc/software/apache/bin/httpd $OPTIONS -k graceful
#ExecStop=/bin/kill -WINCH ${MAINPID}
ExecStop=/scratch/mimisanc/software/apache/bin/httpd $OPTIONS -k graceful-stop
# We want systemd to give httpd some time to finish gracefully, but still want
# it to kill httpd after TimeoutStopSec if something went wrong during the
# graceful stop. Normally, Systemd sends SIGTERM signal right after the
# ExecStop, which would kill httpd. We are sending useless SIGCONT here to give
# httpd time to finish.
#KillSignal=SIGCONT
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
#systemctl enable httpd.service
#systemctl start httpd.service
