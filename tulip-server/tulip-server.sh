#! /bin/bash
#TODO find automatically tulip
source ./config
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$tulip_lib_path
export LD_LIBRARY_PATH

PYTHONPATH=$PYTHONPATH:$tulip_python_path:$entanglement_python_path

export PYTHONPATH

#echo "PYTHONPATH="$PYTHONPATH
#echo "LDLIBRARYPATH="$LD_LIBRARY_PATH

python tulip-server.py
