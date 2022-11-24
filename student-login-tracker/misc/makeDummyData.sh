#!/bin/bash
echo "Removing Old Home Dirs"

rm -rf /home/{rb5565,emc3424,dec8768,jhk5203,lwm2120,xm5723,nxm1137,mmo9420,ttp4725,jmr8990,nmr5651,err4471,drs4281,jy8445,tba8537,sb8715,sec7944,eth7395}

echo "Making New Home Dirs"

mkdir -p /home/{rb5565,emc3424,dec8768,jhk5203,lwm2120,xm5723,nxm1137,mmo9420,ttp4725,jmr8990,nmr5651,err4471,drs4281,jy8445,tba8537,sb8715,sec7944,eth7395}/project{1,2,3,4,5,6,7,8,9,10,11,12}

echo "Generating Dummy Files"

for x in {tba8537,rb5565,sb8715,emc3424,dec8768,sec7944,eth7395,jhk5203,lwm2120,xm5723,nxm1137,mmo9420,ttp4725,jmr8990,nmr5651,err4471,drs4281,jy8445}
do
    for y in {1,2,3,4,5,6,7,8,9,10,11,12}
    do
        for z in {1,2,3}
        do
            git init "/home/$x/project$y" &> /dev/null
            tr -dc 01 < /dev/urandom | fold -w $(($RANDOM % 524288 + 131072)) | head -n $(($RANDOM % 20 + 1)) | tee "/home/$x/project$y/file$z.html" > /dev/null
        done
    done
done

echo "Generating done.txt Files Round 1"

touch /home/{tba8537,rb5565,sb8715,emc3424,dec8768,sec7944,eth7395,jhk5203,lwm2120}/project{1,2,3,4,5,6}/done.txt

echo "Generating done.txt Files Round 2"

touch /home/{xm5723,nxm1137,mmo9420,ttp4725,jmr8990,nmr5651,err4471,drs4281,jy8445}/project{7,8,9,10,11,12}/done.txt