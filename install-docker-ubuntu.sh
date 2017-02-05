echo "This script will install docker and other development tools on Ubuntu 64-bit 16.10, 16.04 or 14.04 versions of Ubuntu. If you do not have those versions of ubuntu please stop now!!!"
echo "I know you want to just trust this file. But I recommend reading it over. Really. Read the file please."


if [ "$EUID" -ne 0  ]
then echo "Please run as root."
    exit
fi

# Code in this file is taken from the following: https://docs.docker.com/engine/installation/linux/ubuntu/
# Do not blindly trust this script. Verify this code by comparing it to official docker install instructions at that link.

# Lets install some tools that make docker run a bit better. 

apt-get update
apt-get -y install curl linux-image-extra-$(uname -r) linux-image-extra-virtual

echo "This is going to install docker by setting up the repository. If you want to do this via deb or another process, check the link inside this script and do it yourself."

# We need to install packages over https. 

apt-get -y install apt-transport-https ca-certificates

# Add the GPG Key
echo "We are about to add the GPG key for the docker repo."

curl -fsSL https://yum.dockerproject.org/gpg | apt-key add -

echo "You should check the fingerprint of that key on your own."

echo "Adding the repository."

apt-get -y install software-properties-common
add-apt-repository \
    "deb https://apt.dockerproject.org/repo/ \
    ubuntu-$(lsb_release -cs) \
    main"

apt-get update 

echo "About to install docker. We are installing a specific version here to avoid potential compatibility issues. The Docker version shouldnt cause issues, but it doesnt hurt to lock it in like this."
apt-get -y install docker-engine

echo "If docker was installed correctly, there should be some hello, world text that appears below this line."

docker run hello-world


# If you want docker to run on startup, uncomment the following lines.
# systemctl enable docker

echo "If you are interested in further configuring Docker, check out the following link: https://docs.docker.com/engine/installation/linux/linux-postinstall/"

# Install docker-compose. We lock the version of this back a bit too to simplify things. Code is taken from: https://docs.docker.com/compose/install/

curl -L "https://github.com/docker/compose/releases/download/1.6.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

echo "Please run the following command in your console:\n\n$ usermod -aG docker \${USER}\n\nIt will add you to the docker group, which is necessary for accessing the docker controls without root."

echo "We have just installed docker and docker-compose to your system. You will need to log out and back in to complete these changes (we needed to add you to the docker group, so you will have to log back in to reeval that properly)."

